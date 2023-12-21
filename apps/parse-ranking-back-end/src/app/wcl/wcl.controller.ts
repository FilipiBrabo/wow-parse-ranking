import { Controller, Get } from '@nestjs/common';

import { WclService } from './wcl.service';

@Controller('wcl')
export class WclController {
  constructor(private readonly wclService: WclService) {}

  @Get()
  updateGuildReports() {
    return this.wclService.updateCharactersDatabase();
  }

  @Get('rank')
  getCharacterRanks() {
    return this.wclService.getCharactersParses();
  }
}
