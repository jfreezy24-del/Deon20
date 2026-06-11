import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContinuityMap, TIMEFRAMES } from '../strat/types';
import { colors } from '../theme';

/** The FTFC strip: one pill per timeframe, green above open / red below. */
export function ContinuityStrip({ map }: { map: ContinuityMap }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>FTFC</Text>
      {TIMEFRAMES.map((tf) => {
        const t = map[tf];
        const color = t === 'up' ? colors.bull : t === 'down' ? colors.bear : colors.flat;
        return (
          <View key={tf} style={[styles.pill, { borderColor: color }]}>
            <Text style={[styles.pillText, { color }]}>
              {tf} {t === 'up' ? '▲' : t === 'down' ? '▼' : '–'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  label: { color: colors.textDim, fontSize: 11, fontWeight: '700', marginRight: 2 },
  pill: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pillText: { fontSize: 11, fontWeight: '600' },
});
