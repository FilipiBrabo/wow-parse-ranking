import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  public constructor(private readonly prisma: PrismaService) {}

  async healthz() {
    // TODO: add wcl connection check

    // await this.prisma.$queryRaw`Select 1+1`;

    return 'OK';
  }
}
