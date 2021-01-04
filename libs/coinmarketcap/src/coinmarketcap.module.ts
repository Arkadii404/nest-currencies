import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoinmarketcapService } from './coinmarketcap.service';
import { coinmarketcapConfig } from './config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(coinmarketcapConfig)],
  providers: [CoinmarketcapService],
  exports: [CoinmarketcapService],
})
export class CoinmarketcapModule {}
