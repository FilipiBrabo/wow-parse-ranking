import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { Injectable } from '@nestjs/common';
import { Character, Encounter, Guild } from '@prisma/client';

import { getCharacterRankingsQuery } from './wcl/gql-queries';
import { WclCharacterRankingsResponse } from './wcl/types';

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();

@Injectable()
export class ApolloService extends ApolloClient<any> {
  constructor() {
    super({
      headers: {
        authorization: `Bearer ${process.env.WCL_API_TOKEN}`,
      },
      uri: 'https://classic.warcraftlogs.com/api/v2/client',
      cache: new InMemoryCache({
        typePolicies: {
          CharacterData: {
            keyFields: ['character', ['name']],
          },
        },
      }),
    });
  }
  public async getCharacterRankings(
    character: Character & { guild: Guild | null },
    encounters: Encounter[]
  ) {
    const query = getCharacterRankingsQuery(encounters);

    try {
      const {
        data: {
          characterData: { character: characterWithRanks },
        },
      } = await this.query<WclCharacterRankingsResponse>({
        query: gql(query),
        variables: {
          characterName: character.name,
          serverSlug: character.serverSlug ?? character.guild?.serverSlug,
          serverRegion: character.serverRegion ?? character.guild?.serverRegion,
        },
      });

      return characterWithRanks;
    } catch (error: unknown) {
      // TODO: handle wcl error
      return undefined;
    }
  }
}
