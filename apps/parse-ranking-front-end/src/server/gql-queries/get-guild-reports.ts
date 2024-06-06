import { gql } from '@apollo/client';

import { Guild } from '../routers/guilds';

export function getGuildReportsQuery(guild: Guild) {
  const query = gql`
    query GuildReports($guildId: Int!) {
      guildData {
        guild(id: $guildId) {
          name
          attendance(limit: 25) {
            data {
              startTime
              code
              players {
                name
                type
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    guildId: guild.wclId,
  };

  return { query, variables };
}
