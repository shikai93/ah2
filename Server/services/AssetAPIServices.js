const sql = require('mssql')
"use strict";
class AssetAPIService {
    constructor (sqlInterface) {
        this.sqlInterface = sqlInterface
    }
    GetEquipmentParameter(assetName, callback) {
        let input = [{
            name : "assetName",
            type : sql.VarChar(255),
            value : assetName
        },{
            name : "projName",
            type : sql.VarChar(255),
            value : "b357"
        }]
        this.sqlInterface.ExecuteStoredProcedure("getEquipmentDataFromAssetName", input, (results, err) => {
            if (err !== null) {
                callback(null, err)
            } else {
                var staticData = JSON.parse(results.recordset[0].output);
                callback(staticData[0], null)
            }
        })
    }
}
module.exports = AssetAPIService;