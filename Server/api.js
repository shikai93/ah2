const ServiceManager = require('./services/ServiceManager.js')
"use strict";
class API {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    CreateForm(callback) {
        this.serviceManager.GetPDFService().CreatePdftest(callback)
    }
    GetDepartments(callback) {
        this.serviceManager.GetSQLService().GetDepartments(callback)
    }
    GetVessels(callback) {
        this.serviceManager.GetSQLService().GetVessels(callback)
    }
    CreateMaintenanceReport(docData,callback) {
        this.serviceManager.GetMaintenanceReportService().SaveMaintenanceReport(docData, callback)
    }
    GetMaintenanceReport(callback) {
        this.serviceManager.GetMaintenanceReportService().GetMaintenanceReport(callback)
    }
}
module.exports = API;