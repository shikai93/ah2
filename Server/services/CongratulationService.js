const crypto = require("crypto");
const REPORTTEMPLATE = 'Congratulations.docx';
const Shell = require('node-powershell');

"use strict";
class CongratulationsService {
    constructor (pdfService,sqlInterface) {
        this.sqlInterface = sqlInterface
        this.pdfService = pdfService
    }
    ConvertDateToString(date) {
        if (date != undefined && date.getDate) {
            var dd = `0${date.getDate()}`
            var mm = `0${date.getMonth()}`
            return `${dd.slice(-2)}-${mm.slice(-2)}-${date.getFullYear()}`
        }
        return ''
    }
    CreateCongratulationNote(docData,callback) {
        console.log("creation demand received")
        const templateFileName = REPORTTEMPLATE
        var outFileName = "Congratulations/Congratulations"
        var id = crypto.randomBytes(20).toString('hex');
        outFileName+=id
        outFileName += '.pdf'
        this.pdfService.CreatePDF(docData,templateFileName, outFileName, (filepath,err) => {
            const ps = new Shell({
                executionPolicy: 'Bypass',
                noProfile: true
                });
            ps.addCommand('$pdfFolder = $(Get-Item -Path "./public/pdfs").FullName');
            ps.addCommand('$pdfPath = "$($pdfFolder)/'+outFileName+'"');
            ps.addCommand(`Start-Process ((Resolve-Path $pdfPath).Path)`);
            ps.invoke()
            .then(output => {
                callback(filepath, null)
            })
            .catch(err => {
                callback(null, err)
            });
        })
    }
}
module.exports = CongratulationsService;