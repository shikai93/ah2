const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const Shell = require('node-powershell');
const crypto = require("crypto");

const outputPDFFolder = "/public/pdfs";
const templateFolder = "/public/templates";

class PDFFormService {
    SaveDocToPDF(tempDocx, outputPDFFolder, pdfFileName, relativePath, callback) {
        const ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
            });
        ps.addCommand('$word_app = New-Object -ComObject Word.Application');
        ps.addCommand('$doc = $word_app.Documents.Open( (Get-Item -Path "./'+tempDocx+'").FullName)');
        ps.addCommand('$pdfFolder = $(Get-Item -Path "./'+outputPDFFolder+'").FullName');
        ps.addCommand('$pdfPath = "$($pdfFolder)/'+pdfFileName+'"');
        ps.addCommand('$doc.SaveAs([ref] $pdfPath, [ref] 17)');
        ps.addCommand('$doc.Close()');
        ps.addCommand('$word_app.Quit()');
        ps.invoke()
        .then(output => {
            fs.unlink(tempDocx, (err) => {})
            ps.dispose();
            callback(relativePath, null)
        })
        .catch(err => {
            ps.dispose();
            console.log(err);
            callback(null, err)
        });
    }

    CreateDocFromTemplate(templatePath, data, tempDocx) {
        //Create docx from template
        var content = fs.readFileSync(`${templatePath}`, 'binary');
        const doc = new Docxtemplater();
        var zip = new PizZip(content);
        doc.loadZip(zip);
        doc.setData(data);
        try {
            doc.render()
        }
        catch (error) {
            callback(null, error)
        }
        var buf = doc.getZip().generate({type: 'nodebuffer'});
        fs.writeFileSync(tempDocx, buf);
    }

    CreatePDF(docData, templateFileName, outFileName, callback) {
        const relativePath = `${outputPDFFolder}/${outFileName}`
        var id = crypto.randomBytes(20).toString('hex');
        const tempDocx = `${id}.docx`
        this.CreateDocFromTemplate(`.${templateFolder}/${templateFileName}`, docData, tempDocx)
        this.SaveDocToPDF(tempDocx, outputPDFFolder, outFileName, relativePath, callback)
    }

    CreatePdftest(callback){
        const pdfFileName = 'output.pdf'
        const relativePath = `${outputPDFFolder}/${pdfFileName}`
        const tempDocx = 'temp.docx'

        var docData = {
            month: 'February 2018',
            records: [
                {'machine' : 'Main Engine 1' ,
                'oilchangeDate' : '03/09/2016',
                'oilchangeRunningHrs' : 50407,
                'runningHoursSinceLastOilChange' : 8770,
                'oilChangeInterval' : 'See remarks',
                'FOFilterChangeDate' : '29/01/2018',
                'FOFilterChageRunningHrs' : 59452,
                'LOFilterChangeDate' : '29/01/2018',
                'LOFilterChageRunningHrs' :  59452},
                {'machine' : 'Main Engine 2' ,
                'oilchangeDate' : '06/08/2016',
                'oilchangeRunningHrs' : 49772,
                'runningHoursSinceLastOilChange' : 9405,
                'oilChangeInterval' : 'See remarks',
                'FOFilterChangeDate' : '30/01/2018',
                'FOFilterChageRunningHrs' : 57799,
                'LOFilterChangeDate' : '30/01/2018',
                'LOFilterChageRunningHrs' :  57799},
                {'machine' : 'Main Engine 3' ,
                'oilchangeDate' : '07/08/2016',
                'oilchangeRunningHrs' : 47077,
                'runningHoursSinceLastOilChange' : 10011,
                'oilChangeInterval' : 'See remarks',
                'FOFilterChangeDate' : '29/01/2018',
                'FOFilterChageRunningHrs' : 54095,
                'LOFilterChangeDate' : '29/01/2018',
                'LOFilterChageRunningHrs' :  54095},
                {'machine' : 'Harbour Engine' ,
                'oilchangeDate' : '30/01/2018',
                'oilchangeRunningHrs' : 78304,
                'runningHoursSinceLastOilChange' : 310,
                'oilChangeInterval' : 500,
                'FOFilterChangeDate' : '30/01/2018',
                'FOFilterChageRunningHrs' : 78232,
                'LOFilterChangeDate' : '30/01/2018',
                'LOFilterChageRunningHrs' :  78232},
                {'machine' : 'Emergency Gen Engine' ,
                'oilchangeDate' : '02/06/2013',
                'oilchangeRunningHrs' : 2505,
                'runningHoursSinceLastOilChange' : 50,
                'oilChangeInterval' : 500,
                'FOFilterChangeDate' : '02/06/2013',
                'FOFilterChageRunningHrs' : 2505,
                'LOFilterChangeDate' : '02/06/2018',
                'LOFilterChageRunningHrs' :  2505},
                {'machine' : 'Start Air Compressor 1' ,
                'oilchangeDate' : '15/12/2017',
                'oilchangeRunningHrs' : 15614,
                'runningHoursSinceLastOilChange' : 1,
                'oilChangeInterval' : 5000,
                'FOFilterChangeDate' : '',
                'FOFilterChageRunningHrs' : '',
                'LOFilterChangeDate' : '',
                'LOFilterChageRunningHrs' : ''},
                {'machine' : 'Start Air Compressor 2' ,
                'oilchangeDate' : '15/12/2017',
                'oilchangeRunningHrs' : 156200,
                'runningHoursSinceLastOilChange' : 31,
                'oilChangeInterval' : 5000,
                'FOFilterChangeDate' : '',
                'FOFilterChageRunningHrs' : '',
                'LOFilterChangeDate' : '',
                'LOFilterChageRunningHrs' : ''},
                {'machine' : 'Working Air Compressor 1' ,
                'oilchangeDate' : '16/10/2017',
                'oilchangeRunningHrs' : 24500,
                'runningHoursSinceLastOilChange' : 224,
                'oilChangeInterval' : 5000,
                'FOFilterChangeDate' : '',
                'FOFilterChageRunningHrs' : '',
                'LOFilterChangeDate' : '',
                'LOFilterChageRunningHrs' : ''},
                {'machine' : 'Working Air Compressor 2' ,
                'oilchangeDate' : '15/12/2017',
                'oilchangeRunningHrs' : 31700,
                'runningHoursSinceLastOilChange' : 282,
                'oilChangeInterval' : 5000,
                'FOFilterChangeDate' : '',
                'FOFilterChageRunningHrs' : '',
                'LOFilterChangeDate' : '',
                'LOFilterChageRunningHrs' : ''},
            ],
            remarks: [{'remark' : 'Good Job'}]
        }
        //Create docx from template
        this.CreateDocFromTemplate(`.${templateFolder}/OilChangeAndFilterServicing.docx`, docData, tempDocx)
        // create pdf from docx
        this.SaveDocToPDF(tempDocx, outputPDFFolder, pdfFileName, relativePath, callback)
    }
}
module.exports = PDFFormService;