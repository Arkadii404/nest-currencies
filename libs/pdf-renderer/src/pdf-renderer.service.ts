import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfRendererService {
  async render(currencies: any[]): Promise<Buffer> {
    //TODO: render PDF, return image
    return null;
  }
}
