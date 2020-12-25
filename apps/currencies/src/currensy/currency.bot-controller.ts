import { CoinmarketcapService } from '@app/coinmarketcap';
import { Injectable } from '@nestjs/common';
import { PdfRendererService } from 'libs/pdf-renderer/src';
import { Context, Hears } from 'nestjs-telegraf';

@Injectable()
export class CurrencyBotController {
  constructor(
    private readonly coinmarketcapService: CoinmarketcapService,
    private readonly pdfRenderer: PdfRendererService,
  ) {}

  @Hears('statistics')
  async onStatistics(ctx: Context) {
    const currencies = await this.coinmarketcapService.getCurrencies();

    const image = await this.pdfRenderer.render(currencies);

    await ctx.replyWithPhoto({ source: image });
  }
}
