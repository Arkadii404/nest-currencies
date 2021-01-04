import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { pdfRendererConfig } from './config';
import { PdfRendererService } from './pdf-renderer.service';

@Module({
  providers: [PdfRendererService],
  exports: [PdfRendererService],
  imports: [ConfigModule.forFeature(pdfRendererConfig)],
})
export class PdfRendererModule {}
