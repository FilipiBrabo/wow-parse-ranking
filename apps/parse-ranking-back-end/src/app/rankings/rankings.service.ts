import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class RankingService {
  constructor(private prismaService: PrismaService) {}

  async getTop25Players(encounterIds: number[]) {
    const averageBestRanks = await this.prismaService.$queryRaw`
    SELECT
      "maxRanks".name,
      "Guild".name as "guildName",
      "Guild"."wclId" as "guildId",
      "Guild"."serverSlug" as "realm",
      "Guild"."serverRegion" as "region",
      "characterId" as "id",
      "class" as "className",
      "spec",
      ROUND(SUM("maxTodayPercent"::numeric)/${encounterIds.length}, 2) AS "rank"
    FROM (
      SELECT
        "name",
        "guildId",
        "class",
        "characterId",
        "encounterId",
        "spec",
        MAX("todayPercent") AS "maxTodayPercent"
      FROM "Ranking" as R INNER JOIN "Character" as C ON C.id = R."characterId"
      WHERE "todayPercent" IS NOT NULL AND "encounterId" = ANY(${encounterIds})
      GROUP BY "characterId", "encounterId", "name", "spec", "guildId", "class"
      ) as "maxRanks"
    LEFT JOIN "Guild" ON "Guild".id = "guildId"
    GROUP BY "maxRanks"."characterId", "maxRanks".name, "spec", "guildId", "Guild".name, "Guild"."serverSlug", "class", "Guild"."wclId",  "Guild"."serverRegion"
    ORDER BY "rank" DESC
    LIMIT 25
    `;

    return averageBestRanks;
  }
}
