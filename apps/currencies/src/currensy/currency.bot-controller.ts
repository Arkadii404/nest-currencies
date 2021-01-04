import { Injectable } from '@nestjs/common';
import { CoinmarketcapService } from '@app/coinmarketcap';
import { PdfRendererService } from '@app/pdf-renderer/pdf-renderer.service';
import { Context, Hears, Start, Help } from 'nestjs-telegraf';

@Injectable()
export class CurrencyBotController {
  constructor(
    private readonly coinmarketcapService: CoinmarketcapService,
    private readonly pdfRenderer: PdfRendererService,
  ) {}

  @Start()
  start(ctx: Context): void {
    ctx.reply('Welcome');
    ctx.reply(
      'If you want to get currencies, use /get . Use /help to see more comands',
    );
  }

  @Help()
  help(ctx: Context): void {
    ctx.replyWithHTML(`
      <b>Available comands:</b>
      /get - Get currencies
    `);
  }

  @Hears('/get')
  hears(ctx: Context): void {
    ctx.reply('Hey there');
  }

  // @Hears('statistics')
  // async onStatistics(ctx: Context) {
  //   const currencies = await this.coinmarketcapService.getCurrencies();

  //   const image = await this.pdfRenderer.renderAll(currencies);

  //   await ctx.replyWithPhoto({ source: image });
  // }
}
