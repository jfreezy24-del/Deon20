export const colors = {
  bg: '#0b0f14',
  card: '#121a23',
  cardBorder: '#1e2a38',
  text: '#e6edf3',
  textDim: '#8b98a5',
  accent: '#4ea1ff',
  bull: '#22c55e',
  bear: '#ef4444',
  flat: '#64748b',
  warn: '#f59e0b',
  chip: '#1b2632',
  chipActive: '#2563eb',
};

export const confidenceColor = (score: number) =>
  score >= 65 ? colors.bull : score >= 45 ? colors.warn : colors.textDim;
