import Model from '../../Models/Models.js'

class PDFExporter extends Model{
    CreateMaintenanceReportPDF = (docData,callback) => {
        super.postReq('/pdf/maintenanereport/create' , docData, (value,error) => {
            if (error === null) {
                console.log(value);
                callback(true);
            } else {
                console.log(error)
                callback(false);
            } 
        })
    }
    CreateWeeklyDefectPDF = (docData,callback) => {
        super.postReq('/pdf/weeklydefect/create' , docData, (value,error) => {
            if (error === null) {
                console.log(value);
                callback(true);
            } else {
                console.log(error)
                callback(false);
            } 
        })
    }
    CreateDailyBunkerPDF = (docData,callback) => {
        super.postReq('/pdf/dailybunker/create' , docData, (value,error) => {
            if (error === null) {
                console.log(value);
                callback(true);
            } else {
                console.log(error)
                callback(false);
            } 
        })
    }
}
export default PDFExporter;