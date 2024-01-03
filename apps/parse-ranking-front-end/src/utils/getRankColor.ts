export function getRankColor(rank: number) {
  if (rank === 100) return '#e5cc80';
  if (rank >= 99) return '#e268a8';
  if (rank >= 95) return '#ff8000';
  if (rank >= 75) return '#a335ee';
  if (rank >= 50) return '#0070ff';
  if (rank >= 25) return '#1eff00';

  return '#666666';
}
