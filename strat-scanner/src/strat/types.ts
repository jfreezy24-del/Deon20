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
  /** e.g. "2-1-2 Bullish Reversal" */
  pattern: string;
  /** Candle sequence as traders write it, e.g. "2d-1-?" */
  sequence: string;
  /** SETUP = waiting for trigger, TRIGGERED = trigger level already broken by the forming bar */
  status: 'SETUP' | 'TRIGGERED';
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
