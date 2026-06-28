import { PatternMatch } from './patterns';
import { ContinuityScore } from './continuity';
import { Candle, ConfidenceFactor, Levels } from './types';

export interface ConfidenceInput {
  pattern: PatternMatch;
  continuity: ContinuityScore;
  levels: Levels;
  completed: Candle[];
  triggered: boolean;
}

export interface ConfidenceResult {
  score: number;
  label: 'High' | 'Medium' | 'Low';
  factors: ConfidenceFactor[];
}

/**
 * Transparent additive confidence model. Every factor that moves the score is
 * reported so the user can see exactly why a signal is rated the way it is.
 */
export function scoreConfidence(input: ConfidenceInput): ConfidenceResult {
  const { pattern, continuity, levels, completed, triggered } = input;
  const factors: ConfidenceFactor[] = [];
  const add = (label: string, points: number) => factors.push({ label, points });

  add(`${pattern.name} base pattern quality`, pattern.baseScore);

  // Compression forks (X-1-?) are the cleanest potential setups: an inside bar
  // gives the tightest, best-defined risk and the direction is still undecided.
  if (pattern.compression) {
    add('Inside-bar compression (tight, undecided X-1-? fork)', 6);
  }

  // Full timeframe continuity
  if (continuity.full) {
    add('Full timeframe continuity (all timeframes pointed with the trade)', 24);
  } else {
    if (continuity.aligned.length > 0) {
      add(`Timeframe continuity: ${continuity.aligned.join(', ')} aligned`, continuity.aligned.length * 7);
    }
    if (continuity.opposed.length > 0) {
      add(`Timeframe conflict: ${continuity.opposed.join(', ')} against the trade`, continuity.opposed.length * -6);
    }
  }

  // Reward-to-risk to the first magnitude target
  if (levels.rr1 >= 2) add(`Strong reward/risk to first target (${levels.rr1}R)`, 10);
  else if (levels.rr1 >= 1) add(`Acceptable reward/risk to first target (${levels.rr1}R)`, 5);
  else add(`First target closer than the risk (${levels.rr1}R)`, -5);

  // Trigger bar close location: closing near the favorable end of its range
  // (hammer for bullish, shooter for bearish) shows participation.
  const trig = completed[completed.length - 1];
  const range = trig.high - trig.low;
  if (range > 0) {
    const pos = (trig.close - trig.low) / range; // 0 = at low, 1 = at high
    if (pattern.direction === 'bullish' && pos >= 0.66) {
      add('Trigger bar closed in the top third of its range (buyers in control)', 5);
    } else if (pattern.direction === 'bearish' && pos <= 0.34) {
      add('Trigger bar closed in the bottom third of its range (sellers in control)', 5);
    }
  }

  // Volume expansion on the trigger bar vs recent average
  const volWindow = completed.slice(-21, -1).map((c) => c.volume).filter((v) => v > 0);
  if (volWindow.length >= 5 && trig.volume > 0) {
    const avg = volWindow.reduce((a, b) => a + b, 0) / volWindow.length;
    if (trig.volume > avg * 1.2) add('Above-average volume on the trigger bar', 5);
  }

  // Reversal sequences are higher conviction than raw momentum when continuity backs them
  if (pattern.isReversal && continuity.aligned.length >= 2) {
    add('Reversal sequence already backed by higher-timeframe direction', 4);
  }

  if (triggered) add('Trigger already broken — the "?" resolved, setup in force', 6);

  const raw = factors.reduce((a, f) => a + f.points, 0);
  const score = Math.max(5, Math.min(95, Math.round(raw)));
  const label = score >= 65 ? 'High' : score >= 45 ? 'Medium' : 'Low';
  return { score, label, factors };
}
