import { Controller, Get } from '@nestjs/common';

import { WclService } from './wcl.service';

@Controller('wcl')
export class WclController {
  constructor(private readonly wclService: WclService) {}

  @Get('/characters')
  updateGuildReports() {
    return this.wclService.updateCharactersDatabase();
  }

  @Get('/ranks')
  updateCharacterRanks() {
    return this.wclService.updateCharacterRanks();
  }
}
