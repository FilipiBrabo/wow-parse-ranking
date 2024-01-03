import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';

import { RankingService } from './rankings.service';

@Controller('/rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('top25')
  getTop25players(
    @Query('encounterIds', new ParseArrayPipe({ items: Number }))
    encounterIds: number[]
  ) {
    return this.rankingService.getTop25Players(encounterIds);
  }
}
