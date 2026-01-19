export function getRankColor(rank: number) {
  if (rank === 100) return 'rank-gold';
  if (rank >= 99) return 'rank-pink';
  if (rank >= 95) return 'rank-orange';
  if (rank >= 75) return 'rank-purple';
  if (rank >= 50) return 'rank-blue';
  if (rank >= 25) return 'rank-green';

  return 'rank-gray';
}
