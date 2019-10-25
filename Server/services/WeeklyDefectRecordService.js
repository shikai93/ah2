const crypto = require("crypto");
const sql = require('mssql')
const WEEKLYDEFECTTEMPLATE = 'WeeklyDefectRecords.docx';
"use strict";
class WeeklyDefectRecordService {
    constructor (pdfService,sqlInterface) {
        this.sqlInterface = sqlInterface
        this.pdfService = pdfService
    }
    GetWeeklyDefectRecords(callback) {
        this.sqlInterface.PerformQuery("SELECT reportedDate, v.name AS vessel, d.name AS dept, filepath FROM WeeklyDefect AS wd JOIN Vessel AS v ON v.vesselId = wd.vesselId JOIN Dept AS d ON d.deptId = wd.deptId",[],(results,error) => {
            callback(results,error)
        })
    }
    SaveWeeklyDefectRecord(docData,callback) {
        var batchid = crypto.randomBytes(20).toString('hex');
        if (Array.isArray(docData.records)) {
            docData.records.forEach((record,index) => {
                var date = new Date(record.completionDate)
                var dd = `0${date.getDate()}`
                var mm = `0${date.getMonth()}`
                // insert into record table
                this.sqlInterface.PerformQuery(
                    "INSERT INTO WeeklyDefectRecord (expectedCompletionDate, description, PRNumber, WRNumber, remarks) VALUES (@date, @description, @prno, @wrno, @remarks);"+
                    "INSERT INTO WeeklyDefect_Record (record_id, defect_id, batch_id) VALUES ((SELECT SCOPE_IDENTITY()),-1,@batchId)",
                    [{ 
                        name : 'date',
                        type : sql.DateTime,
                        value : date
                    },{
                        name : 'description',
                        type : sql.VarChar(sql.MAX),
                        value : record.description
                    },{
                        name : 'prno',
                        type : sql.Int,
                        value : record.prno
                    },{
                        name : 'wrno',
                        type : sql.Int,
                        value : record.wrno
                    },{
                        name : 'remarks',
                        type : sql.VarChar(1000),
                        value : record.remarks
                    },{
                        name : 'batchId',
                        type : sql.VarChar(50),
                        value : batchid
                    }],
                    null
                )
                docData.records[index].sn = index
                docData.records[index].completionDateStr = `${dd.slice(-2)}-${mm.slice(-2)}-${date.getFullYear()}`
            })
        } else {
            docData.records = []
        }
        this.CreateWeeklyDefect(docData,(relativePath, err) => {
            if (err == null) {
                // insert into report table
                this.sqlInterface.PerformQuery(
                    "DELETE FROM WeeklyDefectRecord WHERE recordId = (SELECT record_id FROM WeeklyDefect_Record WHERE defect_id=(SELECT id FROM WeeklyDefect WHERE reportedDate = @reportedDate AND vesselId = (SELECT vesselId FROM Vessel WHERE name=@vessel) AND deptId = (SELECT deptId FROM Dept WHERE name=@dept)));" +
                    "DELETE FROM WeeklyDefect_Record WHERE defect_id=(SELECT id FROM WeeklyDefect WHERE reportedDate = @reportedDate AND vesselId = (SELECT vesselId FROM Vessel WHERE name=@vessel) AND deptId = (SELECT deptId FROM Dept WHERE name=@dept));" +
                    "DELETE FROM WeeklyDefect WHERE reportedDate = @reportedDate AND vesselId = (SELECT vesselId FROM Vessel WHERE name=@vessel) AND deptId = (SELECT deptId FROM Dept WHERE name=@dept);"+
                    "INSERT INTO WeeklyDefect (vesselId, deptId, reportedDate, master, filepath)"+
                    " VALUES ( (SELECT vesselId FROM Vessel WHERE name=@vessel), (SELECT deptId FROM Dept WHERE name=@dept), @reportedDate, @master, @filepath);"+
                    "UPDATE WeeklyDefect_Record SET defect_id=(SELECT SCOPE_IDENTITY()), batch_id=NULL WHERE batch_id=@batchId;",
                    [{ 
                        name : 'vessel',
                        type : sql.VarChar(255),
                        value : docData.vessel
                    },{
                        name : 'dept',
                        type : sql.VarChar(255),
                        value : docData.dept
                    },{
                        name : 'reportedDate',
                        type : sql.DateTime,
                        value : docData.reportedDate
                    },{
                        name : 'master',
                        type : sql.VarChar(255),
                        value : docData.master
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
    CreateWeeklyDefect(docData,callback) {
        const templateFileName = WEEKLYDEFECTTEMPLATE
        var outFileName = "WeeklyDefect/WeeklyDefect"
        var date = docData.reportedDate
        if (date != undefined && date.getDate) {
            var dd = `0${date.getDate()}`
            var mm = `0${date.getMonth()}`
            docData.reportedDateStr = `${dd.slice(-2)}-${mm.slice(-2)}-${date.getFullYear()}`
            outFileName += docData.reportedDateStr
        } else {
            var id = crypto.randomBytes(20).toString('hex');
            outFileName+=id
        }
        outFileName += '.pdf'
        this.pdfService.CreatePDF(docData,templateFileName, outFileName, callback)
    }
}
module.exports = WeeklyDefectRecordService;