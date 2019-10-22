const SQLInterface = require("./interfaces/SQLInterface.js");
"use strict";
class SqlService {
    constructor () {
        this.sqlInterface = new SQLInterface()
    }
    GetDepartments(callback) {
        this.sqlInterface.PerformQuery(
            "SELECT name FROM Dept"
            ,[],callback)
    }
    GetVessels(callback) {
        this.sqlInterface.PerformQuery(
            "SELECT name FROM Vessel"
            ,[],callback)
    }
}
module.exports = SqlService;