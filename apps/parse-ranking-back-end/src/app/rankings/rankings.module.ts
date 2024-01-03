import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { RankingController } from './rankings.controller';
import { RankingService } from './rankings.service';

@Module({
  imports: [],
  controllers: [RankingController],
  providers: [PrismaService, RankingService],
})
export class RankingsModule {}
