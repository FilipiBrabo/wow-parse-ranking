import { ApolloClient, InMemoryCache } from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { Injectable } from '@nestjs/common';

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
}
