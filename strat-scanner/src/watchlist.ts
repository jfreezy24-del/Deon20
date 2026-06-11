import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'strat-scanner/watchlist';

export const DEFAULT_WATCHLIST = [
  'SPY',
  'QQQ',
  'IWM',
  'AAPL',
  'MSFT',
  'NVDA',
  'TSLA',
  'AMZN',
  'META',
  'GOOGL',
  'AMD',
  'BTC-USD',
  'ETH-USD',
  'EURUSD=X',
  'GC=F',
];

export async function loadWatchlist(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const list = JSON.parse(raw) as string[];
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_WATCHLIST;
}

export async function saveWatchlist(list: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // non-fatal: scan still works, persistence is best-effort
  }
}
