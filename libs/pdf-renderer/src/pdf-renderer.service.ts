import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PDFDocument } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import { promises as fs } from 'fs';
import { pdfRendererConfig } from './config';
import { Currency } from '../../domain/src/models/currency.model';

@Injectable()
export class PdfRendererService {
  constructor(
    @Inject(pdfRendererConfig.KEY)
    private readonly config: ConfigType<typeof pdfRendererConfig>,
  ) {}

  private async render(
    currencies: Currency[],
    template: { name: string },
  ): Promise<Buffer> {
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
      semibold: await pdfDoc.embedFont(
        await fs.readFile('./assets/fonts/Semibold.otf'),
      ),
      bold: await pdfDoc.embedFont(
        await fs.readFile('./assets/fonts/Bold.otf'),
      ),
    };

    const date = new Date();

    firstPage.drawText(date.getDate().toString(), {
      font: fonts.bold,
      color: this.config.colors.white,
      x: 884,
      y: 1450,
    });

    firstPage.drawText(this.config.monthes[date.getMonth()].toUpperCase(), {
      font: fonts.bold,
      color: this.config.colors.white,
      x: 884,
      y: 1400,
    });

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
}
