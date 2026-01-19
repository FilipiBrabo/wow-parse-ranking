import { WclCharacterWithRanks } from '../types';

export function getMostRecentReportDate(
  characterEncounterRankings: WclCharacterWithRanks
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const { classID, id, name, ...encounterRankings } =
    characterEncounterRankings;

  const startTimes = Object.values(encounterRankings).flatMap(
    (encounterRankings) => {
      if (!encounterRankings.ranks) return 0;
      return encounterRankings.ranks.map((rank) => rank.startTime);
    }
  );

  const mostRecentReportStartTime = startTimes.sort((a, b) => b - a).at(0);

  if (!mostRecentReportStartTime) {
    return;
  }

  return new Date(mostRecentReportStartTime);
}
