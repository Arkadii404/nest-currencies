import { CoinmarketcapModule } from '@app/coinmarketcap';
import { Module } from '@nestjs/common';

import { PdfRendererModule } from '@app/pdf-renderer';

import { CurrencyBotController } from './currency.bot-controller';

@Module({
  imports: [CoinmarketcapModule, PdfRendererModule],
  providers: [CurrencyBotController],
})
export class CurrencyModule {}
