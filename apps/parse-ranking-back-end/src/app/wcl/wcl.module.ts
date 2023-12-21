import { Module } from '@nestjs/common';

import { ApolloService } from '../apollo.service';
import { PrismaService } from '../prisma.service';
import { WclController } from './wcl.controller';
import { WclService } from './wcl.service';

@Module({
  imports: [],
  controllers: [WclController],
  providers: [WclService, PrismaService, ApolloService],
})
export class WclModule {}
