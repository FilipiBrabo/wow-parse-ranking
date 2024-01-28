import { Controller, Get, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { PrismaService } from '../prisma.service';
import { RankingService } from './rankings.service';

export class RankingsOptions {
  @IsNumber()
  @Type(() => Number)
  public limit = 15;

  @IsNumber()
  @Type(() => Number)
  public offset = 0;

  @IsString()
  @IsOptional()
  public class: string;

  @IsString()
  @IsOptional()
  public spec: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public guildId: string;
}

@Controller('/rankings')
export class RankingController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rankingService: RankingService
  ) {}

  @Get('icc')
  async getIccRankings(@Query() options: RankingsOptions) {
    const encounters = await this.prisma.encounter.findMany({
      select: {
        id: true,
      },
      where: {
        Raid: { name: 'Icecrown Citadel' },
      },
    });

    const encounterIds = encounters.map((encounter) => encounter.id);

    const { total, items } = await this.rankingService.getRanks(
      encounterIds,
      options
    );

    return {
      items,
      total,
      limit: options.limit,
      offset: options.offset,
    };
  }
}
