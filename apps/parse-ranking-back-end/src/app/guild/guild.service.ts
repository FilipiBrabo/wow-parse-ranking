import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class GuildService {
  constructor(private prismaService: PrismaService) {}
  async getGuilds() {
    return this.prismaService.guild.findMany();
  }
}
