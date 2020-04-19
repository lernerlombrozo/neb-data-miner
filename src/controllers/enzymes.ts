import fs from 'fs';
import path from 'path';
import config from 'config';
import moment from 'moment';

import { RequestHandler } from 'express';
import pdfDocument from 'pdfkit';


import * as ENZYMES from './../neb-data-miner';

export const getEnzymes: RequestHandler = (req, res, next) => {
    res.status(201).json({enzymes: ENZYMES});
};


export const getEnzymesPDF: RequestHandler = (req, res, next) => {
    const now = new Date();
    const pdfDoc = new pdfDocument();

    const invoiceName:string = config.get('tableURL');;
    const invoicePath = path.join('data', 'invoices', invoiceName);

    res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${invoiceName}"`
      );

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(16).text(config.get("author"));
    pdfDoc.text("Assignment 2");
    pdfDoc.text(moment().format("MMMM Do YYYY"));
    pdfDoc.text("------------------------------------------------------------------------------------")
    pdfDoc.end();
};