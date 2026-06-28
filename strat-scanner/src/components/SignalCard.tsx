import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Signal } from '../strat/types';
import { colors, confidenceColor } from '../theme';
import { ContinuityStrip } from './ContinuityStrip';

const fmt = (v: number) => (v >= 1000 ? v.toFixed(2) : v >= 1 ? v.toFixed(2) : v.toFixed(5));

function LevelRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.levelRow}>
      <Text style={styles.levelLabel}>{label}</Text>
      <Text style={[styles.levelValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

export function SignalCard({ signal, isNew = false }: { signal: Signal; isNew?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const bull = signal.direction === 'bullish';
  const dirColor = bull ? colors.bull : colors.bear;
  const confColor = confidenceColor(signal.confidence);

  return (
    <Pressable
      style={[styles.card, isNew && { borderColor: colors.warn }]}
      onPress={() => setExpanded((e) => !e)}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.symbol}>
            {signal.symbol} <Text style={styles.price}>{fmt(signal.lastPrice)}</Text>
            {isNew ? <Text style={styles.newBadge}>  NEW</Text> : null}
          </Text>
          <Text style={[styles.pattern, { color: dirColor }]}>
            {bull ? '▲' : '▼'} {signal.pattern} <Text style={styles.sequence}>({signal.sequence})</Text>
          </Text>
          <View style={styles.tagRow}>
            <View
              style={[
                styles.scenarioTag,
                { backgroundColor: signal.scenario === 'reversal' ? colors.warn : colors.chipActive },
              ]}
            >
              <Text style={styles.scenarioText}>
                {signal.scenario === 'reversal' ? 'REVERSAL' : 'CONTINUATION'}
              </Text>
            </View>
            {signal.compression ? (
              <View style={styles.compTag}>
                <Text style={styles.compText}>X-1-? COMPRESSION</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.badges}>
          <View style={[styles.tfBadge]}>
            <Text style={styles.tfBadgeText}>{signal.timeframe}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: signal.status === 'TRIGGERED' ? dirColor : colors.chip },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: signal.status === 'TRIGGERED' ? '#0b0f14' : colors.textDim },
              ]}
            >
              {signal.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Confidence meter */}
      <View style={styles.confRow}>
        <View style={styles.confTrack}>
          <View
            style={[styles.confFill, { width: `${signal.confidence}%`, backgroundColor: confColor }]}
          />
        </View>
        <Text style={[styles.confText, { color: confColor }]}>
          {signal.confidence}% {signal.confidenceLabel}
        </Text>
      </View>

      {/* Entry / exits */}
      <View style={styles.levelsBox}>
        <LevelRow label={bull ? 'Entry (buy stop)' : 'Entry (sell stop)'} value={fmt(signal.levels.entry)} color={colors.accent} />
        <LevelRow label="Stop (invalidation)" value={fmt(signal.levels.stop)} color={colors.bear} />
        <LevelRow
          label={`Target 1 · ${signal.levels.rr1}R`}
          value={fmt(signal.levels.target1)}
          color={colors.bull}
        />
        <LevelRow
          label={`Target 2 · ${signal.levels.rr2}R`}
          value={fmt(signal.levels.target2)}
          color={colors.bull}
        />
      </View>

      <ContinuityStrip map={signal.continuity} />

      {expanded ? (
        <View style={styles.explainBox}>
          <Text style={styles.explainTitle}>Why this setup is valid</Text>
          <Text style={styles.explainText}>{signal.explanation}</Text>
          <Text style={styles.explainTitle}>Confidence breakdown</Text>
          {signal.factors.map((f, i) => (
            <Text key={i} style={styles.factorText}>
              {f.points >= 0 ? '+' : ''}
              {f.points}  {f.label}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.tapHint}>Tap for explanation & confidence breakdown</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  symbol: { color: colors.text, fontSize: 17, fontWeight: '800' },
  newBadge: { color: colors.warn, fontSize: 11, fontWeight: '900' },
  price: { color: colors.textDim, fontSize: 13, fontWeight: '500' },
  pattern: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  sequence: { color: colors.textDim, fontWeight: '500', fontSize: 12 },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 5 },
  scenarioTag: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  scenarioText: { color: '#0b0f14', fontWeight: '900', fontSize: 9, letterSpacing: 0.5 },
  compTag: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: colors.chip,
    borderColor: colors.cardBorder,
    borderWidth: 1,
  },
  compText: { color: colors.textDim, fontWeight: '800', fontSize: 9, letterSpacing: 0.5 },
  badges: { alignItems: 'flex-end', gap: 4 },
  tfBadge: {
    backgroundColor: colors.chipActive,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tfBadgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontWeight: '800', fontSize: 10 },
  confRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  confTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.chip,
    overflow: 'hidden',
  },
  confFill: { height: 6, borderRadius: 3 },
  confText: { fontSize: 12, fontWeight: '700', width: 86, textAlign: 'right' },
  levelsBox: {
    marginTop: 10,
    backgroundColor: colors.bg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  levelLabel: { color: colors.textDim, fontSize: 12 },
  levelValue: { color: colors.text, fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  explainBox: { marginTop: 10 },
  explainTitle: { color: colors.text, fontWeight: '800', fontSize: 12, marginTop: 8, marginBottom: 3 },
  explainText: { color: colors.textDim, fontSize: 13, lineHeight: 19 },
  factorText: { color: colors.textDim, fontSize: 12, lineHeight: 18 },
  tapHint: { color: colors.flat, fontSize: 11, marginTop: 8, textAlign: 'center' },
});
