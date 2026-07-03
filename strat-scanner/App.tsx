import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { scanMarket, ScanResult } from './src/scanner';
import { Signal, Timeframe, TIMEFRAMES } from './src/strat/types';
import { DEFAULT_WATCHLIST, loadWatchlist, saveWatchlist } from './src/watchlist';
import { ALGO_UNIVERSE } from './src/strat/universe';
import { buildAlgoAlerts, RelatedPlay } from './src/strat/algoAlerts';
import { SignalCard } from './src/components/SignalCard';
import { colors } from './src/theme';

type DirFilter = 'all' | 'bullish' | 'bearish';

/**
 * Scanner mode sweeps the personal watchlist for every potential setup;
 * Algo mode replicates the Strat Algo Alerts service — Mag 7 + liquid ETFs,
 * confirmed triggers only, daily structure and up, with related sector plays.
 */
type Mode = 'scanner' | 'algo';

const AUTO_OPTIONS = [0, 1, 5, 15] as const; // minutes; 0 = off

/** Identity of a signal including its state, so SETUP -> TRIGGERED counts as new. */
const signalKey = (s: Signal) =>
  `${s.symbol}-${s.timeframe}-${s.direction}-${s.setupBarTime}-${s.status}`;

export default function App() {
  const [mode, setMode] = useState<Mode>('scanner');
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [newSymbol, setNewSymbol] = useState('');
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<ScanResult | null>(null);
  const [tfFilter, setTfFilter] = useState<Timeframe | 'all'>('all');
  const [dirFilter, setDirFilter] = useState<DirFilter>('all');
  const [minConf, setMinConf] = useState(0);
  const [compOnly, setCompOnly] = useState(false);
  const [autoMinutes, setAutoMinutes] = useState<(typeof AUTO_OPTIONS)[number]>(0);
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());
  const prevKeysRef = useRef<Set<string> | null>(null);
  const scanningRef = useRef(false);

  useEffect(() => {
    loadWatchlist().then(setWatchlist);
  }, []);

  const runScan = useCallback(async () => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanning(true);
    const symbols = mode === 'algo' ? ALGO_UNIVERSE : watchlist;
    setProgress({ done: 0, total: symbols.length });
    try {
      const res = await scanMarket(symbols, (done, total) => setProgress({ done, total }));

      // Diff against the previous sweep so fresh setups and SETUP -> TRIGGERED
      // transitions are flagged; buzz when a signal has newly fired.
      const keys = new Set(res.signals.map(signalKey));
      const prev = prevKeysRef.current;
      if (prev) {
        const fresh = res.signals.filter((s) => !prev.has(signalKey(s)));
        setNewKeys(new Set(fresh.map(signalKey)));
        if (fresh.some((s) => s.status === 'TRIGGERED')) Vibration.vibrate(400);
      } else {
        setNewKeys(new Set());
      }
      prevKeysRef.current = keys;

      setResult(res);
      if (res.errors.length > 0 && res.signals.length === 0) {
        Alert.alert('Scan problem', res.errors.map((e) => `${e.symbol}: ${e.message}`).join('\n'));
      }
    } catch (e) {
      Alert.alert('Scan failed', e instanceof Error ? e.message : String(e));
    } finally {
      scanningRef.current = false;
      setScanning(false);
    }
  }, [watchlist, mode]);

  // Each mode sweeps a different universe, so its results and NEW-badge
  // baseline don't carry over.
  const switchMode = useCallback((m: Mode) => {
    setMode((prev) => {
      if (prev !== m) {
        setResult(null);
        setNewKeys(new Set());
        prevKeysRef.current = null;
      }
      return m;
    });
  }, []);

  // Auto-scan: re-sweep the watchlist on the chosen interval while the app is
  // in the foreground (intervals are throttled/suspended in the background).
  const runScanRef = useRef(runScan);
  runScanRef.current = runScan;
  useEffect(() => {
    if (autoMinutes === 0) return;
    runScanRef.current();
    const id = setInterval(() => {
      if (AppState.currentState === 'active') runScanRef.current();
    }, autoMinutes * 60_000);
    return () => clearInterval(id);
  }, [autoMinutes]);

  const addSymbol = useCallback(() => {
    const sym = newSymbol.trim().toUpperCase();
    if (!sym) return;
    if (watchlist.includes(sym)) {
      setNewSymbol('');
      return;
    }
    const next = [...watchlist, sym];
    setWatchlist(next);
    saveWatchlist(next);
    setNewSymbol('');
  }, [newSymbol, watchlist]);

  const removeSymbol = useCallback(
    (sym: string) => {
      const next = watchlist.filter((s) => s !== sym);
      setWatchlist(next);
      saveWatchlist(next);
    },
    [watchlist],
  );

  // Algo mode: distill the sweep to confirmed algo-grade triggers, keeping
  // the related sector plays each one surfaces.
  const algoAlerts = useMemo(
    () => (mode === 'algo' && result ? buildAlgoAlerts(result.signals) : []),
    [mode, result],
  );
  const relatedFor = useMemo(
    () => new Map<string, RelatedPlay[]>(algoAlerts.map((a) => [signalKey(a.signal), a.relatedPlays])),
    [algoAlerts],
  );

  const filtered: Signal[] = useMemo(() => {
    if (!result) return [];
    if (mode === 'algo') {
      return algoAlerts
        .map((a) => a.signal)
        .filter((s) => dirFilter === 'all' || s.direction === dirFilter);
    }
    return result.signals.filter(
      (s) =>
        (tfFilter === 'all' || s.timeframe === tfFilter) &&
        (dirFilter === 'all' || s.direction === dirFilter) &&
        (!compOnly || s.compression) &&
        s.confidence >= minConf,
    );
  }, [result, mode, algoAlerts, tfFilter, dirFilter, minConf, compOnly]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{mode === 'algo' ? 'Strat Algo Alerts' : 'Strat Scanner'}</Text>
            <Text style={styles.subtitle}>
              {mode === 'algo'
                ? 'Confirmed triggers only · Mag 7 + liquid ETFs · D / W / M'
                : 'Potential #TheStrat setups · X-1-? · 4H / D / W / M'}
            </Text>
          </View>
          {mode === 'scanner' && (
            <Pressable style={styles.wlButton} onPress={() => setShowWatchlist((v) => !v)}>
              <Text style={styles.wlButtonText}>{showWatchlist ? 'Done' : `Watchlist (${watchlist.length})`}</Text>
            </Pressable>
          )}
        </View>

        {/* Mode switch */}
        <View style={styles.modeRow}>
          {(['scanner', 'algo'] as const).map((m) => (
            <Pressable
              key={m}
              style={[styles.modeBtn, mode === m && styles.chipActive]}
              onPress={() => switchMode(m)}
            >
              <Text style={[styles.chipText, mode === m && styles.chipTextActive]}>
                {m === 'scanner' ? 'Scanner' : '⚡ Algo Alerts'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Watchlist editor */}
        {mode === 'scanner' && showWatchlist && (
          <View style={styles.wlBox}>
            <View style={styles.wlInputRow}>
              <TextInput
                style={styles.wlInput}
                placeholder="Add symbol (AAPL, BTC-USD, EURUSD=X, GC=F)"
                placeholderTextColor={colors.flat}
                value={newSymbol}
                onChangeText={setNewSymbol}
                autoCapitalize="characters"
                autoCorrect={false}
                onSubmitEditing={addSymbol}
              />
              <Pressable style={styles.addBtn} onPress={addSymbol}>
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            </View>
            <View style={styles.wlChips}>
              {watchlist.map((sym) => (
                <Pressable key={sym} style={styles.wlChip} onPress={() => removeSymbol(sym)}>
                  <Text style={styles.wlChipText}>{sym} ✕</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Scan button */}
        <Pressable
          style={[styles.scanBtn, scanning && styles.scanBtnBusy]}
          onPress={runScan}
          disabled={scanning}
        >
          {scanning ? (
            <View style={styles.scanBusyRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.scanBtnText}>
                Scanning {progress.done}/{progress.total}…
              </Text>
            </View>
          ) : (
            <Text style={styles.scanBtnText}>
              {mode === 'algo' ? 'SCAN ALGO UNIVERSE' : 'SCAN MARKETS'}
            </Text>
          )}
        </Pressable>

        {/* Auto-scan interval */}
        <View style={styles.autoRow}>
          <Text style={styles.autoLabel}>Auto-scan</Text>
          {AUTO_OPTIONS.map((m) => (
            <Pressable
              key={m}
              style={[styles.chip, autoMinutes === m && styles.chipActive]}
              onPress={() => setAutoMinutes(m)}
            >
              <Text style={[styles.chipText, autoMinutes === m && styles.chipTextActive]}>
                {m === 0 ? 'Off' : `${m}m`}
              </Text>
            </Pressable>
          ))}
          {autoMinutes > 0 && (
            <Text style={styles.autoLive}>● LIVE</Text>
          )}
        </View>

        {/* Filters — Algo mode is pre-filtered by design, only direction applies */}
        <View style={styles.filterRow}>
          {mode === 'scanner' &&
            (['all', ...TIMEFRAMES] as const).map((tf) => (
              <Pressable
                key={tf}
                style={[styles.chip, tfFilter === tf && styles.chipActive]}
                onPress={() => setTfFilter(tf)}
              >
                <Text style={[styles.chipText, tfFilter === tf && styles.chipTextActive]}>
                  {tf === 'all' ? 'All TF' : tf}
                </Text>
              </Pressable>
            ))}
          <View style={styles.filterSpacer} />
          {(['all', 'bullish', 'bearish'] as const).map((d) => (
            <Pressable
              key={d}
              style={[styles.chip, dirFilter === d && styles.chipActive]}
              onPress={() => setDirFilter(d)}
            >
              <Text
                style={[
                  styles.chipText,
                  dirFilter === d && styles.chipTextActive,
                  d === 'bullish' && { color: colors.bull },
                  d === 'bearish' && { color: colors.bear },
                ]}
              >
                {d === 'all' ? 'All' : d === 'bullish' ? '▲' : '▼'}
              </Text>
            </Pressable>
          ))}
          {mode === 'scanner' && (
            <>
              <Pressable
                style={[styles.chip, minConf > 0 && styles.chipActive]}
                onPress={() => setMinConf((m) => (m === 0 ? 45 : m === 45 ? 65 : 0))}
              >
                <Text style={[styles.chipText, minConf > 0 && styles.chipTextActive]}>
                  {minConf === 0 ? 'Any conf' : `≥${minConf}%`}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.chip, compOnly && styles.chipActive]}
                onPress={() => setCompOnly((v) => !v)}
              >
                <Text style={[styles.chipText, compOnly && styles.chipTextActive]}>X-1-? only</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Results */}
        <FlatList
          data={filtered}
          keyExtractor={(s) => `${s.symbol}-${s.timeframe}-${s.direction}-${s.setupBarTime}`}
          renderItem={({ item }) => (
            <SignalCard
              signal={item}
              isNew={newKeys.has(signalKey(item))}
              related={relatedFor.get(signalKey(item))}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
          ListHeaderComponent={
            result ? (
              <Text style={styles.resultMeta}>
                {filtered.length} signal{filtered.length === 1 ? '' : 's'} · scanned{' '}
                {new Date(result.scannedAt).toLocaleTimeString()}
                {result.errors.length > 0 ? ` · ${result.errors.length} symbol(s) failed` : ''}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {result
                  ? mode === 'algo'
                    ? 'No confirmed triggers right now'
                    : 'No potential setups match the current filters'
                  : 'Ready to scan'}
              </Text>
              <Text style={styles.emptyText}>
                {result
                  ? mode === 'algo'
                    ? 'The algo only alerts when a high-conviction Strat trigger has actually broken on daily structure or higher in the Mag 7 + liquid-ETF universe. Sometimes that is zero — the setup is either there or it isn\'t. Rescan later.'
                    : 'Loosen the timeframe/direction/confidence filters (or the X-1-? toggle), or rescan later — actionable Strat bars form and resolve constantly.'
                  : mode === 'algo'
                    ? 'Tap SCAN ALGO UNIVERSE to sweep the Mag 7 and the most liquid ETFs for CONFIRMED #TheStrat triggers on the Daily, Weekly and Monthly charts — ticker, direction, setup, entry, risk line and related sector plays. No noise, no maybes.'
                    : 'Tap SCAN MARKETS to sweep your watchlist for POTENTIAL #TheStrat setups — unresolved X-1-? forks (2-1-2, 3-1-2, 2-2, Rev Strats and more) where the next bar could break into a reversal or a continuation, on the 4H, Daily, Weekly and Monthly charts.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '900' },
  subtitle: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  wlButton: {
    backgroundColor: colors.chip,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  wlButtonText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  wlBox: { paddingHorizontal: 16, paddingBottom: 6 },
  wlInputRow: { flexDirection: 'row', gap: 8 },
  wlInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: colors.chipActive,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  addBtnText: { color: '#fff', fontWeight: '800' },
  wlChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  wlChip: {
    backgroundColor: colors.chip,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  wlChipText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  scanBtn: {
    backgroundColor: colors.chipActive,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  scanBtnBusy: { opacity: 0.7 },
  scanBtnText: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  scanBusyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: colors.chip,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  autoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  autoLabel: { color: colors.textDim, fontSize: 12, fontWeight: '700', marginRight: 2 },
  autoLive: { color: colors.bull, fontSize: 11, fontWeight: '800', marginLeft: 4 },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterSpacer: { width: 8 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.chipActive },
  chipText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  resultMeta: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  empty: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 60 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  emptyText: { color: colors.textDim, fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
