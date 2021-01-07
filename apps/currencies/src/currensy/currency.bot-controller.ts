import { Injectable } from '@nestjs/common';
import { CoinmarketcapService } from '@app/coinmarketcap';
import { PdfRendererService } from '@app/pdf-renderer/pdf-renderer.service';
import { Context, Hears, Start, Help } from 'nestjs-telegraf';

@Injectable()
export class CurrencyBotController {
  constructor(
    private readonly coinmarketcapService: CoinmarketcapService,
    private readonly pdfRendererService: PdfRendererService,
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
  async hears(ctx: Context): Promise<void> {
    const images = await this.pdfRendererService.renderAll(
      await this.coinmarketcapService.getCurrencies(),
    );
    images.forEach(img => ctx.replyWithPhoto({ source: img }));
  }
}
