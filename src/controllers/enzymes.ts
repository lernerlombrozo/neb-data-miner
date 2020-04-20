import fs from 'fs';
import path from 'path';
import config from 'config';
import moment from 'moment';

import { RequestHandler } from 'express';
import pdfDocument from 'pdfkit';
import PdfPrinter from 'pdfmake';


import * as ENZYMES from './../neb-data-miner';

export const getEnzymes: RequestHandler = (req, res, next) => {
    res.status(201).json({enzymes: ENZYMES});
};


export const getEnzymesPDF: RequestHandler = (req, res, next) => {
    console.log("here)")
    const reportName:string = config.get('tableURL');;
    const reportPath = path.join('data', 'reports', reportName+".pdf");
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${reportName}"`
      );
      
      let printer = new PdfPrinter(fonts);
      let linebreak = "--------------------------------------------------------------------------------------------------------------------------------";
      let spacebreak = "\n"
      let docDefinition = {
        content: [
          { 
            text: config.get("author") as string, 
            style: "header"
          },
          { 
            text: config.get("title") as string, 
            style: "header" 
          },
          { 
            text: moment().format("MMMM Do YYYY"), 
            style: "header"
          },
          linebreak,
          {
            text:problem1,
            style:"problem"
          },
          spacebreak,
          {
            text:solution1,
            style:"solution"
          },
          spacebreak,
          {
            text:problem2,
            style:"problem"
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: getEnzymeTable(),
              style: "solution"
            }
          }
        ],
        styles: {
          header: {
            bold: true,
            alignment: 'right'
          },
          problem: {
            color:"blue",
            fontSize: 10,
          },
          solution: {
            color:"black",
            fontSize: 10,
          }
        },
        defaultStyle: {
          font: 'Helvetica',
          lineHeight: 1.5
        }
      };
      // @ts-ignore
      var pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(reportPath));
      pdfDoc.end();
      const file = fs.createReadStream(reportPath);
      file.pipe(res);
    // pdfDoc.fontSize(16).text();
    // pdfDoc.text("Assignment 2");
    // pdfDoc.text();
    // pdfDoc.text("------------------------------------------------------------------------------------")
    // pdfDoc.end();
};


let fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};

let problem1 = `PROBLEM 1:

You are studying a gene from phage T4 called ac gene. This gene confers the phage with resistance to the compound acriflavine. The gene sequence is 156 bases long and can be found below (every 15 bases are shown in bold for rapid assessment of position):  

ATG AAT ATT GCA AAA TTA TTA GGA GTT ATT30 TCA TTT ATT TGT TGG ATA GTA GCA TGT GTT60 TTA ACT ATC TGT ATC GAT GCT AGC AGT GTG90 TTT TCA CAA GCT TTA GCC CAG GGT ATG TGT120 GCA TAT TTA ACA TTT GTG TTG TTA TCT AAT150 GAT TAA

a) Provide the amino acid sequence for the protein coded by the genetic sequence provided above. `;

let solution1 = `MNIAKLLGVISFICWIVACVLTICIDASSVFSQALAQGMCAYLTFVLLSND-

Amino acid code for reference: 
• G - Glycine (Gly)
• P - Proline (Pro)
• A - Alanine (Ala)
• V - Valine (Val)
• L - Leucine (Leu)
• I - Isoleucine (Ile)
• M - Methionine (Met)
• C - Cysteine (Cys)
• F - Phenylalanine (Phe)
• Y - Tyrosine (Tyr)
• W - Tryptophan (Trp)
• H - Histidine (His)
• K - Lysine (Lys)
• R - Arginine (Arg)
• Q - Glutamine (Gln)
• N - Asparagine (Asn)
• E - Glutamic Acid (Glu)
• D - Aspartic Acid (Asp)
• S - Serine (Ser)
• T - Threonine (Thr)`;


let problem2 = `
b) Using the NEBcutter tool from New England Biolabs (found at http://nc2.neb.com/NEBcutter2/), build the following table for the restriction enzymes that can be used on this gene.
Note: In the NEBcutter tool, bases designated by N = any; B = C, G or T; D = A, G or T; H = A, C or T; V = A, C or G; W = A or T; S = C or G; R = A or G; Y = C or T; M = A or C; K = G or T. In the table below, indicate the actual bases in the gene sequence.`


let tableHeaders = ["Restriction enzyme","location","Type	of ends	produced","Sequence","Temperature of reaction (ºC)","Neosch- izomers","Isosch- izomers"];

function getEnzymeTable(): (string|{ text: string, fontSize: number })[][]{
  let enzymeTable: (string|{ text: string, fontSize: number })[][] = [tableHeaders];
  let fontSize =10;
  ENZYMES.ENZYMES.forEach(enzyme => {
    let enzymeRow: (string | { text: string, fontSize: number })[] = [];
    enzymeRow[0] = { text: enzyme.name, fontSize };
    enzymeRow[1] = { text: enzyme.location.replace('<font color="#FF4500">#</font>', "").replace('<font color="#483D8B">*</font>', ""), fontSize };
    enzymeRow[2] = { text: enzyme.ends, fontSize };
    enzymeRow[3] = { text: enzyme.sequence.replace("<sub>", "").replace("</sub>", ""), fontSize };
    enzymeRow[4] = { text: enzyme.temperature.replace("&deg;C", "ºC"), fontSize };
    enzymeRow[5] = { text: enzyme.neoschizomers.toString(), fontSize };
    enzymeRow[6] = { text: enzyme.isoschizomers.toString(), fontSize };
    enzymeTable.push(enzymeRow);
  });
  console.log(enzymeTable);
  return enzymeTable;
}