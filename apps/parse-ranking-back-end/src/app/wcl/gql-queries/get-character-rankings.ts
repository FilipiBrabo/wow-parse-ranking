import { gql } from '@apollo/client';
import { Character, Encounter, Raid } from '@prisma/client';

import { parseEncounterName } from '../utils';

export function getCharacterRankingsQuery(
  character: Character,
  encounters: (Encounter & { Raid: Raid })[]
) {
  const query = gql`
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
                }, size: ${encounter.size}, partition: ${
                  encounter.Raid.partition
                })`
            )
            .concat('\n')}
        }
      }
    }
  `;

  const variables = {
    characterName: character.name,
    serverSlug: character.serverSlug,
    serverRegion: character.serverRegion,
  };

  return { query, variables };
}
