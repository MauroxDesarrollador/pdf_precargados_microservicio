import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf/pdf.service';

@Controller()
export class AppController {
  constructor(private PdfService:PdfService) {}
  @Get('apda')
  async getPdf(@Res() res: Response) {
      try {
          const pdfBytes = await this.PdfService.generatePdf();
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename="filled.pdf"');
          res.send(Buffer.from(pdfBytes));
      } catch (error) {
          console.error('Error processing PDF:', error);
          res.status(500).send('Error processing PDF');
      }
  }

  @Get('apda-return')
  async getPdfInline(@Res() res: Response) {
      try {
          const pdfBytes = await this.PdfService.generatePdf();
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename="filled.pdf"');
          res.send(Buffer.from(pdfBytes));
      } catch (error) {
          console.error('Error processing PDF:', error);
          res.status(500).send('Error processing PDF');
      }
  }
}
