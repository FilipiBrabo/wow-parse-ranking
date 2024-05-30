import { gql } from '@apollo/client';

import { Character, EncounterWithRankings } from '../routers/characters';
import { parseEncounterName } from '../utils';

export function getWclCharacterRankingsQuery(
  character: Character,
  encounters: EncounterWithRankings
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
                  encounter.raid.partition?.wclId
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
