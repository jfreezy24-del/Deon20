export interface Candle {
  /** Bar open time, unix seconds */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * TheStrat candle classification, relative to the previous bar:
 *  '1'  = inside bar      (took out neither side)
 *  '2u' = directional up  (took out the high only)
 *  '2d' = directional down(took out the low only)
 *  '3'  = outside bar     (took out both sides)
 */
export type CandleType = '1' | '2u' | '2d' | '3';

export type Timeframe = '4H' | 'D' | 'W' | 'M';

export const TIMEFRAMES: Timeframe[] = ['4H', 'D', 'W', 'M'];

export type Direction = 'bullish' | 'bearish';

/** Whether breaking the trigger that way reverses or continues the order flow. */
export type Scenario = 'reversal' | 'continuation';

export type TFTrend = 'up' | 'down' | 'flat';

/** Direction of the currently forming candle on each timeframe (close vs open). */
export type ContinuityMap = Partial<Record<Timeframe, TFTrend>>;

export interface ConfidenceFactor {
  label: string;
  points: number;
}

export interface Levels {
  /** Stop entry order level: break of the trigger bar */
  entry: number;
  /** Invalidation: opposite side of the setup */
  stop: number;
  /** First magnitude target (nearest prior pivot) */
  target1: number;
  /** Extended target */
  target2: number;
  /** Reward-to-risk to target1 */
  rr1: number;
  /** Reward-to-risk to target2 */
  rr2: number;
}

export interface Signal {
  symbol: string;
  symbolName?: string;
  lastPrice: number;
  timeframe: Timeframe;
  direction: Direction;
  /** e.g. "2-1-2 Reversal" */
  pattern: string;
  /** Unresolved candle sequence ending in the "?" next bar, e.g. "2d-1-?" */
  sequence: string;
  /**
   * POTENTIAL = the fork is pending, waiting for the "?" bar to break a trigger.
   * TRIGGERED = the trigger level has already been broken by the forming bar.
   */
  status: 'POTENTIAL' | 'TRIGGERED';
  /** Whether a break this way reverses or continues order flow */
  scenario: Scenario;
  /** Actionable bar is an inside bar (1) — a clean X-1-? compression fork */
  compression: boolean;
  isReversal: boolean;
  confidence: number; // 0-100
  confidenceLabel: 'High' | 'Medium' | 'Low';
  factors: ConfidenceFactor[];
  explanation: string;
  levels: Levels;
  continuity: ContinuityMap;
  /** Bar time of the trigger (setup) candle */
  setupBarTime: number;
}
