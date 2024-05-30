import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://classic.warcraftlogs.com/api/v2/client',
      headers: {
        authorization: `Bearer ${process.env.WCL_API_TOKEN}`,
      },
    }),

    cache: new InMemoryCache({
      typePolicies: {
        CharacterData: {
          keyFields: ['character', ['name']],
        },
      },
    }),
  });
});
