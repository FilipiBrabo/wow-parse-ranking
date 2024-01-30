import { Encounter } from '@prisma/client';
import { groupBy, maxBy, pickBy } from 'lodash';

import { INVALID_SPECS_BY_CLASS_ID } from '../constants';
import { WclCharacterWithRanks, WclRank } from '../types';
import { parseEncounterName } from './parse-encounter-name';

export function getBestRanks(
  characterWithRanks: WclCharacterWithRanks,
  encounters: Encounter[]
) {
  const bestCharacterRanks = encounters.flatMap((encounter) => {
    const encounterRanks =
      characterWithRanks[parseEncounterName(encounter.name)]?.ranks;

    // Group by spec and get for each spec the best rank
    // Also filters invalid specs
    const bestEncounterRanks = Object.values(
      pickBy(
        groupBy(encounterRanks, (rank) => rank.spec),
        (_, spec) => {
          const invalidSpecs =
            INVALID_SPECS_BY_CLASS_ID[characterWithRanks.classID];
          return !invalidSpecs?.includes(spec);
        }
      )
    ).map((ranks) => maxBy(ranks, (rank) => rank.todayPercent));

    const isRank = (rank: WclRank | undefined): rank is WclRank => !!rank;

    return bestEncounterRanks.filter(isRank).map((rank) => ({
      encounterId: encounter.id,
      reportCode: rank.report.code,
      spec: rank.spec,
      lockedIn: rank.lockedIn,
      todayPercent: rank.todayPercent,
      duration: rank.duration,
      amount: rank.amount,
    }));
  });

  return bestCharacterRanks;
}
