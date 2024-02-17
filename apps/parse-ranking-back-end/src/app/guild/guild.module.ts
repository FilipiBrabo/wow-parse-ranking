import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';

@Module({
  imports: [],
  controllers: [GuildController],
  providers: [GuildService, PrismaService],
})
export class GuildModule {}
