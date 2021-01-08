import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFFont, PDFImage, PDFPage } from 'pdf-lib';
import { promises as fs } from 'fs';

import { pdfRendererConfig } from './config';
import { Currency } from '../../domain/src/models/currency.model';
import { doc } from 'prettier';

type FontTypes = 'light' | 'bold';

type IconTypes = 'BTC' | 'ETH' | 'LTC' | 'USDT' | 'XRP';

type Renderd = { pdf: Buffer; name: string };

@Injectable()
export class PdfRendererService implements OnModuleInit {
  private readonly step = 260;
  private preparedPDFs: Record<
    string,
    {
      doc: PDFDocument;
      fonts?: Record<FontTypes, PDFFont>;
      icons?: Record<IconTypes, PDFImage>;
    }
  > = {};

  constructor(
    @Inject(pdfRendererConfig.KEY)
    private readonly config: ConfigType<typeof pdfRendererConfig>,
  ) {}

  async onModuleInit() {
    const { templates } = this.config;

    const fontFiles: Record<FontTypes, Buffer> = {
      light: await fs.readFile('./assets/fonts/Light.otf'),
      bold: await fs.readFile('./assets/fonts/Bold.otf'),
    };

    const iconFiles: Record<IconTypes, Buffer> = {
      BTC: await fs.readFile(`./assets/icons/BTC.png`),
      ETH: await fs.readFile(`./assets/icons/ETH.png`),
      LTC: await fs.readFile(`./assets/icons/LTC.png`),
      USDT: await fs.readFile(`./assets/icons/USDT.png`),
      XRP: await fs.readFile(`./assets/icons/XRP.png`),
    };

    await Promise.all(
      templates.map(async template => {
        this.preparedPDFs[template.name] = {
          doc: await PDFDocument.load(
            await fs.readFile(`./assets/templates/${template.name}.pdf`),
          ),
        };

        this.preparedPDFs[template.name].doc.registerFontkit(fontkit);

        this.preparedPDFs[template.name].fonts = {
          light: await this.preparedPDFs[template.name].doc.embedFont(
            fontFiles.light,
          ),
          bold: await this.preparedPDFs[template.name].doc.embedFont(
            fontFiles.bold,
          ),
        };

        this.preparedPDFs[template.name].icons = {
          BTC: await this.preparedPDFs[template.name].doc.embedPng(
            iconFiles.BTC,
          ),
          ETH: await this.preparedPDFs[template.name].doc.embedPng(
            iconFiles.ETH,
          ),
          LTC: await this.preparedPDFs[template.name].doc.embedPng(
            iconFiles.LTC,
          ),
          USDT: await this.preparedPDFs[template.name].doc.embedPng(
            iconFiles.USDT,
          ),
          XRP: await this.preparedPDFs[template.name].doc.embedPng(
            iconFiles.XRP,
          ),
        };
      }),
    );
  }

  private async render(
    currencies: Currency[],
    template: { name: string; fixes: any },
  ): Promise<Renderd> {
    const { fonts, doc, icons } = this.preparedPDFs[template.name];

    const pages = doc.getPages();
    const firstPage = pages[0];

    this.renderDate(firstPage, fonts.bold, template.fixes);

    await Promise.all(
      currencies.map(async (c, i) => {
        this.renderCurrency(firstPage, fonts, icons, template.fixes, c, i);
        return c;
      }),
    );

    const pdf = Buffer.from(await doc.save());

    return { pdf, name: template.name };
  }

  public async renderAll(currencies: Currency[]): Promise<Renderd[]> {
    const files: Renderd[] = [];

    await Promise.all(
      this.config.templates.map(async template =>
        files.push(await this.render(currencies, template)),
      ),
    );

    return files;
  }

  private renderDate(firstPage: PDFPage, boldFont: PDFFont, fixes: any): void {
    const date = new Date();

    const dateNow =
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();

    firstPage.drawText(dateNow, {
      font: boldFont,
      color: this.config.colors.white,
      x: this.getCenteredX(boldFont, dateNow, 72, 876, 1022),
      y: 1473 + (fixes?.date?.y || 0),
      size: 72,
    });

    const month = this.config.monthes[date.getMonth()].toUpperCase();

    firstPage.drawText(month, {
      font: boldFont,
      color: this.config.colors.white,
      x: this.getCenteredX(boldFont, month, 24, 876, 1022),
      y: 1430 + (fixes?.date?.y || 0),
      size: 24,
    });
  }

  private async renderCurrency(
    firstPage: PDFPage,
    fonts: Record<FontTypes, PDFFont>,
    icons: Record<IconTypes, PDFImage>,
    fixes: any,
    currency: Currency,
    i: number,
  ): Promise<void> {
    const icon = icons[currency.symbol];
    firstPage.drawImage(icon, {
      x: 110,
      y: 165 + i * this.step,
      width: 90,
      height: 90,
    });

    const name = currency.name.toUpperCase();
    firstPage.drawText(name, {
      font: fonts.bold,
      color: this.config.colors.blue,
      size: 48,
      x: 275,
      y: 255 + i * this.step,
    });

    const price = this.formatPrice(currency.price);
    firstPage.drawText(price, {
      font: fonts.light,
      color: this.config.colors.white,
      size: 80,
      x: 275,
      y: 130 + i * this.step,
    });

    const change = this.formatChange(currency.change);
    firstPage.drawText(change, {
      font: fonts.light,
      color:
        currency.change >= 0
          ? this.config.colors.green
          : this.config.colors.red,
      size: 60,
      x: this.getRightAlignX(fonts.light, change, 60, 920),
      y: 130 + i * this.step,
    });
  }

  private getCenteredX(
    font: PDFFont,
    text: string,
    textSize: number,
    minX: number,
    maxX: number,
  ): number {
    const middle = (maxX - minX) / 2;
    const textWith = font.widthOfTextAtSize(text, textSize);
    return minX + middle - textWith / 2;
  }

  private getRightAlignX(
    font: PDFFont,
    text: string,
    textSize: number,
    endX: number,
  ): number {
    const textWith = font.widthOfTextAtSize(text, textSize);
    return endX - textWith;
  }

  private formatPrice(price: number): string {
    price = Number(price.toFixed(6));
    const formated = new Intl.NumberFormat('en-US', {
      useGrouping: true,
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 6,
      maximumSignificantDigits: 7,
    }).format(price);

    return formated;
  }

  private formatChange(change: number): string {
    const formated = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(change);
    return `${change > 0 ? '+' : ''}${formated}%`;
  }
}
