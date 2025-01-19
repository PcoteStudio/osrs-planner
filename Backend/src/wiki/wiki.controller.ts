import { Controller, Get } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { ScrapeResult } from './wiki.interface';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get('scrape')
  GetScrape(): ScrapeResult {
    return this.wikiService.GetScrape();
  }
}
