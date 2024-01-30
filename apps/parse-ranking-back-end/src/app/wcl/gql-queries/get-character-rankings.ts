import { Encounter } from '@prisma/client';

import { parseEncounterName } from '../utils';

export function getCharacterRankingsQuery(encounters: Encounter[]) {
  return `
    query GetCharacterRankings(
      $characterName: String!
      $serverSlug: String!
      $serverRegion: String!
    ) {
      characterData {
        character(
          name: $characterName
          serverSlug: $serverSlug
          serverRegion: $serverRegion
        ) {
          id
          name
          classID
          ${encounters
            .map(
              (encounter) =>
                `${parseEncounterName(
                  encounter.name
                )}: encounterRankings(encounterID: ${
                  encounter.wclId
                }, role: DPS, metric: dps, difficulty: ${
                  encounter.difficulty
                }, size: ${encounter.size})`
            )
            .concat('\n')}
        }
      }
    }
  `;
}
