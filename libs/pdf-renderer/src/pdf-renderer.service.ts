import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PDFDocument, PDFFont } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import { promises as fs } from 'fs';
import { pdfRendererConfig } from './config';
import { Currency } from '../../domain/src/models/currency.model';

@Injectable()
export class PdfRendererService {
  private readonly step = 260;

  constructor(
    @Inject(pdfRendererConfig.KEY)
    private readonly config: ConfigType<typeof pdfRendererConfig>,
  ) {}

  private async render(
    currencies: Currency[],
    template: { name: string; fixes: any },
  ): Promise<Buffer> {
    console.log(currencies);

    const pdfDoc = await PDFDocument.load(
      await fs.readFile(`./assets/templates/${template.name}.pdf`),
    );

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    pdfDoc.registerFontkit(fontkit);

    const fonts = {
      light: await pdfDoc.embedFont(
        await fs.readFile('./assets/fonts/Light.otf'),
      ),
      bold: await pdfDoc.embedFont(
        await fs.readFile('./assets/fonts/Bold.otf'),
      ),
    };

    const date = new Date();

    firstPage.drawText(date.getDate().toString(), {
      font: fonts.bold,
      color: this.config.colors.white,
      x: this.getCenteredX(
        fonts.bold,
        date.getDate().toString(),
        72,
        876,
        1032,
      ),
      y: 1473 + (template.fixes?.date?.y || 0),
      size: 72,
    });

    firstPage.drawText(this.config.monthes[date.getMonth()].toUpperCase(), {
      font: fonts.bold,
      color: this.config.colors.white,
      x: this.getCenteredX(
        fonts.bold,
        this.config.monthes[date.getMonth()].toUpperCase(),
        24,
        876,
        1032,
      ),
      y: 1430 + (template.fixes?.date?.y || 0),
      size: 24,
    });

    await Promise.all(
      currencies.reverse().map(async (c, i) => {
        const icon = await pdfDoc.embedPng(
          await fs.readFile(`./assets/icons/${c.symbol}.png`),
        );

        firstPage.drawImage(icon, {
          x: 110,
          y: 165 + i * this.step,
          width: 90,
          height: 90,
        });

        firstPage.drawText(c.name.toUpperCase(), {
          font: fonts.bold,
          color: this.config.colors.blue,
          size: 48,
          x: 275,
          y: 255 + i * this.step,
        });

        firstPage.drawText(this.formatPrice(c.price), {
          font: fonts.light,
          color: this.config.colors.white,
          size: 80,
          x: 275,
          y: 130 + i * this.step,
        });

        firstPage.drawText(this.formatChange(c.change), {
          font: fonts.light,
          color:
            c.change >= 0 ? this.config.colors.green : this.config.colors.red,
          size: 60,
          x: 700,
          y: 130 + i * this.step,
        });

        return c;
      }),
    );

    const pdfBytes = Buffer.from(await pdfDoc.save());

    return pdfBytes;
  }

  public async renderAll(currencies: Currency[]): Promise<Buffer[]> {
    const files: Buffer[] = [];

    await Promise.all(
      this.config.templates.map(async template =>
        files.push(await this.render(currencies, template)),
      ),
    );

    return files;
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
