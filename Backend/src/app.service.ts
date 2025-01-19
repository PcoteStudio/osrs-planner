import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { success: boolean } {
    return { success: true };
  }
}
