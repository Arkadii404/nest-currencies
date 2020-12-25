import { HttpModule, Module } from '@nestjs/common';

import { CoinmarketcapService } from './coinmarketcap.service';

@Module({
  imports: [HttpModule],
  providers: [CoinmarketcapService],
  exports: [CoinmarketcapService],
})
export class CoinmarketcapModule {}
