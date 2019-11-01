const ServiceManager = require('./services/ServiceManager.js')
"use strict";
class API {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    GetDepartments(callback) {
        this.serviceManager.GetSQLService().GetDepartments(callback)
    }
    GetVessels(callback) {
        this.serviceManager.GetSQLService().GetVessels(callback)
    }
    // Weekly Defect
    CreateWeeklyDefect(docData, callback) {
        this.serviceManager.GetWeeklyDefectService().SaveWeeklyDefectRecord(docData, callback)
    }
    GetWeeklyDefect( callback) {
        this.serviceManager.GetWeeklyDefectService().GetWeeklyDefectRecords(callback)
    }
    // Maintenance Report
    CreateMaintenanceReport(docData,callback) {
        this.serviceManager.GetMaintenanceReportService().SaveMaintenanceReport(docData, callback)
    }
    GetMaintenanceReport(callback) {
        this.serviceManager.GetMaintenanceReportService().GetMaintenanceReport(callback)
    }
    // Daily Bunker
    CreateDailyBunkerRecord(docData,callback) {
        this.serviceManager.GetDailyBunkerService().SaveDailyBunkerRecord(docData, callback)
    }
    GetDailyBunkerRecords(callback) {
        this.serviceManager.GetDailyBunkerService().GetDailyBunkerRecord(callback)
    }
    // Access Control
    Login(username, password, callback) {
        this.serviceManager.GetUserAccountService().Login(username, password, callback)
    }
    VerifyToken(userId, token, callback) {
        this.serviceManager.GetUserAccountService().VerifyToken(userId, token, callback)
    }
    // Attendance
    MarkAttendance(docData, callback) {
        this.serviceManager.GetAttendanceService().MarkAttendance(docData, callback)
    }
}
module.exports = API;