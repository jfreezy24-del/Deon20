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
import { SignalCard } from './src/components/SignalCard';
import { colors } from './src/theme';

type DirFilter = 'all' | 'bullish' | 'bearish';

const AUTO_OPTIONS = [0, 1, 5, 15] as const; // minutes; 0 = off

/** Identity of a signal including its state, so SETUP -> TRIGGERED counts as new. */
const signalKey = (s: Signal) =>
  `${s.symbol}-${s.timeframe}-${s.direction}-${s.setupBarTime}-${s.status}`;

export default function App() {
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [newSymbol, setNewSymbol] = useState('');
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<ScanResult | null>(null);
  const [tfFilter, setTfFilter] = useState<Timeframe | 'all'>('all');
  const [dirFilter, setDirFilter] = useState<DirFilter>('all');
  const [minConf, setMinConf] = useState(0);
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
    setProgress({ done: 0, total: watchlist.length });
    try {
      const res = await scanMarket(watchlist, (done, total) => setProgress({ done, total }));

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
  }, [watchlist]);

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

  const filtered: Signal[] = useMemo(() => {
    if (!result) return [];
    return result.signals.filter(
      (s) =>
        (tfFilter === 'all' || s.timeframe === tfFilter) &&
        (dirFilter === 'all' || s.direction === dirFilter) &&
        s.confidence >= minConf,
    );
  }, [result, tfFilter, dirFilter, minConf]);

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
            <Text style={styles.title}>Strat Scanner</Text>
            <Text style={styles.subtitle}>#TheStrat setups · 4H / D / W / M</Text>
          </View>
          <Pressable style={styles.wlButton} onPress={() => setShowWatchlist((v) => !v)}>
            <Text style={styles.wlButtonText}>{showWatchlist ? 'Done' : `Watchlist (${watchlist.length})`}</Text>
          </Pressable>
        </View>

        {/* Watchlist editor */}
        {showWatchlist && (
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
            <Text style={styles.scanBtnText}>SCAN MARKETS</Text>
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

        {/* Filters */}
        <View style={styles.filterRow}>
          {(['all', ...TIMEFRAMES] as const).map((tf) => (
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
          <Pressable
            style={[styles.chip, minConf > 0 && styles.chipActive]}
            onPress={() => setMinConf((m) => (m === 0 ? 45 : m === 45 ? 65 : 0))}
          >
            <Text style={[styles.chipText, minConf > 0 && styles.chipTextActive]}>
              {minConf === 0 ? 'Any conf' : `≥${minConf}%`}
            </Text>
          </Pressable>
        </View>

        {/* Results */}
        <FlatList
          data={filtered}
          keyExtractor={(s) => `${s.symbol}-${s.timeframe}-${s.direction}-${s.setupBarTime}`}
          renderItem={({ item }) => (
            <SignalCard signal={item} isNew={newKeys.has(signalKey(item))} />
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
                {result ? 'No setups match the current filters' : 'Ready to scan'}
              </Text>
              <Text style={styles.emptyText}>
                {result
                  ? 'Loosen the timeframe/direction/confidence filters, or rescan later — actionable Strat bars form and resolve constantly.'
                  : 'Tap SCAN MARKETS to sweep your watchlist for actionable #TheStrat sequences (2-1-2, 3-1-2, 2-2 reversals, Rev Strats and more) on the 4H, Daily, Weekly and Monthly charts.'}
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
