import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { RankingsModule } from './rankings/rankings.module';
import { WclModule } from './wcl/wcl.module';

@Module({
  imports: [RankingsModule, WclModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
