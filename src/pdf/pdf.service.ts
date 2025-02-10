import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
    async generatePdf(jsonData) {
        const pdfPath = path.join(__dirname, '../../', 'apdea.pdf');

        //si quiero leer la data desde el json
        //const jsonDataPath = path.join(__dirname, '../../', 'apda.json');
        // Leer y parsear el archivo JSON
        // const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));

        const existingPdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        fields.forEach((field, index) => {
            const type = field.constructor.name;
           
            const name = field.getName();
            console.log(type)
            if (type === 'PDFTextField' || type === 'PDFNumberField') {
                const jsonField = jsonData.data.find((item: any) => item.index === index);
                if (jsonField!=undefined) {
                   // console.log(index);
                    //console.log(jsonField);
                    const maxLength = (field as any).getMaxLength();
                    const value = String(jsonField.value); // Convertir a cadena de texto
                    const truncatedValue = maxLength ? value.substring(0, maxLength) : value;
                    (field as any).setText(truncatedValue);
                }
            }
        });

        return await pdfDoc.save();
    }
}