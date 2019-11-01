const SQLService = require('./SQLService.js')
const AssetAPIService = require('./AssetAPIServices.js')
const PDFService = require('./PDFFormService.js')
const MaintenanceReportService = require('./MaintenanceReportService.js')
const WeeklyDefectRecordService = require('./WeeklyDefectRecordService.js')
const DailyBunkerRecordService = require('./DailyBunkerRecordService.js')
const AttendanceAPIService = require('./AttendanceAPIService.js')
const UserAccountService = require('./UserAccountService.js')
class ServiceManager {
    constructor () {
        this.sqlService = new SQLService()
        this.assetAPI = new AssetAPIService(this.sqlService.sqlInterface)
        this.pdfService = new PDFService()
        this.maintenanceReportService = new MaintenanceReportService(this.pdfService, this.sqlService.sqlInterface)
        this.WeeklyDefectRecordService = new WeeklyDefectRecordService(this.pdfService, this.sqlService.sqlInterface)
        this.DailyBunkerService = new DailyBunkerRecordService(this.pdfService, this.sqlService.sqlInterface)
        this.UserAccountService = new UserAccountService(this.sqlService.sqlInterface)
        this.AttendanceAPIService = new AttendanceAPIService(this.sqlService.sqlInterface)
    }
    GetSQLService() {
        return this.sqlService;
    }
    GetAssetAPI() {
        return this.assetAPI
    }
    GetPDFService() {
        return this.pdfService;
    }
    GetMaintenanceReportService() {
        return this.maintenanceReportService;
    }
    GetUserAccountService() {
        return this.UserAccountService;
    }
    GetWeeklyDefectService(){
        return this.WeeklyDefectRecordService;
    }
    GetDailyBunkerService(){
        return this.DailyBunkerService;
    }
    GetAttendanceService(){
        return this.AttendanceAPIService;
    }
}
module.exports = ServiceManager;
