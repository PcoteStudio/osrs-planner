import { Injectable } from '@nestjs/common';
import { ScrapeResult } from './wiki.interface';

@Injectable()
export class WikiService {
  GetScrape(): ScrapeResult {
    return { success: false };
  }
}
