import { Controller, Get } from '@nestjs/common';

import { GuildService } from './guild.service';

@Controller('/guilds')
export class GuildController {
  constructor(private readonly guildsService: GuildService) {}

  @Get()
  async getGuilds() {
    return await this.guildsService.getGuilds();
  }
}
