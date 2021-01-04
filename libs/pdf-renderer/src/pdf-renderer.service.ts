import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import { pdfRendererConfig } from './config';
import { Currency } from './models/currency.model';

@Injectable()
export class PdfRendererService {
  constructor(
    @Inject(pdfRendererConfig.KEY)
    private readonly config: ConfigType<typeof pdfRendererConfig>,
  ) {}

  private async render(
    currencies: Currency[],
    template: { name: string },
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(`pdf-renderer/assets/templates/${template.name}.pdf`),
    );

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    pdfDoc.registerFontkit(fontkit);

    const fonts = {
      light: await pdfDoc.embedFont(
        fs.readFileSync('pdf-renderer/assets/fonts/Light.otf'),
      ),
      semibold: await pdfDoc.embedFont(
        fs.readFileSync('pdf-renderer/assets/fonts/Semibold.otf'),
      ),
      bold: await pdfDoc.embedFont(
        fs.readFileSync('pdf-renderer/assets/fonts/Bold.otf'),
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

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  }

  public renderAll(currencies: Currency[]): Uint8Array[] {
    const files: Uint8Array[] = [];

    this.config.templates.forEach(async template =>
      files.push(await this.render(currencies, template)),
    );

    return files;
  }
}
