const SQLService = require('./SQLService.js')
const AssetAPIService = require('./AssetAPIServices.js')
const PDFService = require('./PDFFormService.js')
const MaintenanceReportService = require('./MaintenanceReportService.js')
class ServiceManager {
    constructor () {
        this.sqlService = new SQLService()
        this.assetAPI = new AssetAPIService(this.sqlService.sqlInterface)
        this.pdfService = new PDFService()
        this.maintenanceReportService = new MaintenanceReportService(this.pdfService, this.sqlService.sqlInterface)
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
}
module.exports = ServiceManager;
