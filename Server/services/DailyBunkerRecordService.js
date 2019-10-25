const crypto = require("crypto");
const sql = require('mssql')
const REPORTTEMPLATE = 'DailyBunkerLubricantFWROB.docx';
"use strict";
class DailyBunkerRecordService {
    constructor (pdfService,sqlInterface) {
        this.sqlInterface = sqlInterface
        this.pdfService = pdfService
    }
    GetDailyBunkerRecord(callback) {
        this.sqlInterface.PerformQuery("SELECT reportDate, v.name AS vessel, bunkerROB AS ROB, filepath FROM DailyBunkerStatusRecords AS db JOIN Vessel AS v ON v.vesselId = db.vesselId ",[],(results,error) => {
            callback(results,error)
        })
    }
    SaveDailyBunkerRecord(docData,callback) {
        var batchid = crypto.randomBytes(20).toString('hex');
        if (Array.isArray(docData.records)) {
            docData.records.forEach((record,index) => {
                var date = new Date(record.date)
                var dd = `0${date.getDate()}`
                var mm = `0${date.getMonth()}`
                // insert into record table
                this.sqlInterface.PerformQuery(
                    "INSERT INTO BunkerStatusRecord (date, consumed, ROB) VALUES (@date, @consumed, @rob);"+
                    "INSERT INTO BunkerRecord_Record (recordId, bunkerRecordId, batch_id) VALUES ((SELECT SCOPE_IDENTITY()),-1,@batchId)",
                    [{ 
                        name : 'date',
                        type : sql.Date,
                        value : date
                    },{
                        name : 'consumed',
                        type : sql.Float,
                        value : record.consumed
                    },{
                        name : 'rob',
                        type : sql.VarChar(255),
                        value : record.rob
                    },{
                        name : 'batchId',
                        type : sql.VarChar(50),
                        value : batchid
                    }],
                    null
                )
                docData.records[index].date = `${dd.slice(-2)}-${mm.slice(-2)}-${date.getFullYear()}`
            })
        } else {
            docData.records = []
        }
        this.CreateDailyBunkerRecord(docData,(relativePath, err) => {
            if (err == null) {
                // insert into report table
                this.sqlInterface.PerformQuery(
                    "DELETE FROM BunkerStatusRecord WHERE recordId=(SELECT recordId FROM BunkerRecord_Record WHERE bunkerRecordId=(SELECT recordId FROM DailyBunkerStatusRecords WHERE reportDate = @reportDate AND vesselId=(SELECT vesselId FROM Vessel WHERE name=@vessel)))" +
                    "DELETE FROM BunkerRecord_Record WHERE bunkerRecordId=(SELECT recordId FROM DailyBunkerStatusRecords WHERE reportDate = @reportDate AND vesselId=(SELECT vesselId FROM Vessel WHERE name=@vessel))" +
                    "DELETE FROM DailyBunkerStatusRecords WHERE reportDate = @reportDate AND vesselId=(SELECT vesselId FROM Vessel WHERE name=@vessel)"+
                    "INSERT INTO DailyBunkerStatusRecords (vesselId, lastBunkerDate, lastBunkerQuantity, chiefEngineerName, reportDate, bunkerROB, isMGO, isLO, isFW, filepath)"+
                    " VALUES ( (SELECT vesselId FROM Vessel WHERE name=@vessel), @lastBunkerDate, @lastBunkerQuantity, @chiefEngineerName,@reportDate, @bunkerROB, @isMGO, @isLO, @isFW, @filepath);"+
                    "UPDATE BunkerRecord_Record SET bunkerRecordId=(SELECT SCOPE_IDENTITY()), batch_id=NULL WHERE batch_id=@batchId;",
                    [{ 
                        name : 'vessel',
                        type : sql.VarChar(255),
                        value : docData.vessel
                    },{
                        name : 'reportDate',
                        type : sql.Date,
                        value : new Date(docData.reportDate)
                    },{
                        name : 'lastBunkerDate',
                        type : sql.Date,
                        value : new Date(docData.lastBunkerDate)
                    },{
                        name : 'lastBunkerQuantity',
                        type : sql.Float,
                        value : docData.lastBunkerQuantity
                    },{
                        name : 'chiefEngineerName',
                        type : sql.VarChar(255),
                        value : docData.chiefEngineerName
                    },{
                        name : 'bunkerROB',
                        type : sql.VarChar(255),
                        value : docData.bunkerROB
                    },{
                        name : 'isMGO',
                        type : sql.TinyInt,
                        value : docData.isMGO
                    },{
                        name : 'isLO',
                        type : sql.TinyInt,
                        value : docData.isLO
                    },{
                        name : 'isFW',
                        type : sql.TinyInt,
                        value : docData.isFW
                    },{
                        name : 'batchId',
                        type : sql.VarChar(50),
                        value : batchid
                    },{
                        name : 'filepath',
                        type : sql.VarChar(sql.MAX),
                        value : relativePath
                    }],
                    (recordset, error) => {
                        callback(relativePath, error)
                })
            }
        })
    }
    ConvertDateToString(date) {
        if (date != undefined && date.getDate) {
            var dd = `0${date.getDate()}`
            var mm = `0${date.getMonth()}`
            return `${dd.slice(-2)}-${mm.slice(-2)}-${date.getFullYear()}`
        }
        return ''
    }
    CreateDailyBunkerRecord(docData,callback) {
        const templateFileName = REPORTTEMPLATE
        var outFileName = "DailyBunker/DailyBunker"
        docData['reportDateStr'] = this.ConvertDateToString( new Date(docData.reportDate))
        docData['lastBunkerDateStr'] = this.ConvertDateToString( new Date(docData.lastBunkerDate))
        if (docData.reportDateStr != '') {
            outFileName += docData.reportDateStr
        } else {
            var id = crypto.randomBytes(20).toString('hex');
            outFileName+=id
        }
        outFileName += '.pdf'
        docData['isMGOBool'] = docData.isMGO === 1
        docData['isLOBool'] = docData.isLO === 1
        docData['isFWBool'] = docData.isFW === 1
        this.pdfService.CreatePDF(docData,templateFileName, outFileName, callback)
    }
}
module.exports = DailyBunkerRecordService;