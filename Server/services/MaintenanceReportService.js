const crypto = require("crypto");
const sql = require('mssql')
const MAINTENANCEREPORTTEMPLATE = 'MachineryMaintenanceReport.docx';
"use strict";
class MaintenanceReportService {
    constructor (pdfService,sqlInterface) {
        this.sqlInterface = sqlInterface
        this.pdfService = pdfService
    }
    GetMaintenanceReport(callback) {
        this.sqlInterface.PerformQuery("SELECT month, year, v.name AS vessel, d.name AS dept, filepath FROM MachineryMaintenanceReport JOIN Vessel AS v ON v.vesselId = vessel JOIN Dept AS d ON d.deptId = dept",[],(results,error) => {
            callback(results,error)
        })
    }
    SaveMaintenanceReport(docData,callback) {
        var batchid = crypto.randomBytes(20).toString('hex');
        if (Array.isArray(docData.records)) {
            docData.records.forEach((record,index) => {
                var date = new Date(record.date)
                var dd = `0${date.getDate()}`
                var mm = `0${date.getMonth()}`
                // insert into record table
                this.sqlInterface.PerformQuery(
                    "INSERT INTO MaintenanceReportRecord (date, description, remarks) VALUES (@date, @description, @remarks);"+
                    "INSERT INTO Record_Report (record_id, report_id, batch_id) VALUES ((SELECT SCOPE_IDENTITY()),-1,@batchId)",
                    [{ 
                        name : 'date',
                        type : sql.DateTime,
                        value : date
                    },{
                        name : 'description',
                        type : sql.VarChar(sql.MAX),
                        value : record.description
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
                docData.records[index].date = `${dd.slice(-2)}-${mm.slice(-2)}-${date.getFullYear()}`
            })
        } else {
            docData.records = []
        }
        this.CreateMaintenanceReport(docData,(relativePath, err) => {
            if (err == null) {
                // insert into report table
                this.sqlInterface.PerformQuery(
                    "DELETE FROM MaintenanceReportRecord WHERE recordId=(SELECT record_id FROM Record_Report WHERE report_id=(SELECT reportId FROM MachineryMaintenanceReport WHERE month = @month AND year=@year AND dept=(SELECT deptId FROM Dept WHERE name=@dept) AND vessel=(SELECT vesselId FROM Vessel WHERE name=@vessel)))" +
                    "DELETE FROM Record_Report WHERE report_id=(SELECT reportId FROM MachineryMaintenanceReport WHERE month = @month AND year=@year AND dept=(SELECT deptId FROM Dept WHERE name=@dept) AND vessel=(SELECT vesselId FROM Vessel WHERE name=@vessel))" +
                    "DELETE FROM MachineryMaintenanceReport WHERE month = @month AND year=@year AND dept=(SELECT deptId FROM Dept WHERE name=@dept) AND vessel=(SELECT vesselId FROM Vessel WHERE name=@vessel)"+
                    "INSERT INTO MachineryMaintenanceReport (vessel, dept, month, year, filepath)"+
                    " VALUES ( (SELECT vesselId FROM Vessel WHERE name=@vessel), (SELECT deptId FROM Dept WHERE name=@dept), @month, @year, @filepath);"+
                    "UPDATE Record_Report SET report_id=(SELECT SCOPE_IDENTITY()), batch_id=NULL WHERE batch_id=@batchId;",
                    [{ 
                        name : 'vessel',
                        type : sql.VarChar(255),
                        value : docData.vessel
                    },{
                        name : 'dept',
                        type : sql.VarChar(255),
                        value : docData.dept
                    },{
                        name : 'month',
                        type : sql.VarChar(50),
                        value : docData.month
                    },{
                        name : 'year',
                        type : sql.VarChar(50),
                        value : docData.year
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
    CreateMaintenanceReport(docData,callback) {
        const templateFileName = MAINTENANCEREPORTTEMPLATE
        var outFileName = "MachineryMaintenance/MachineryMaintenanceReport"
        if (docData.month != undefined && docData.year != undefined) {
            outFileName += docData.month 
            outFileName += docData.year 
            var dayCreated = new Date()
            docData['daycreated'] = `${`0${dayCreated.getDate()}`.slice(-2)}-${`0${dayCreated.getMonth()}`.slice(-2)}-${dayCreated.getFullYear()}`
        } else {
            var id = crypto.randomBytes(20).toString('hex');
            outFileName+=id
        }
        outFileName += '.pdf'
        this.pdfService.CreatePDF(docData,templateFileName, outFileName, callback)
    }
}
module.exports = MaintenanceReportService;