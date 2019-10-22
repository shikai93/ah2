const sql = require('mssql')

"use strict";
class SqlInterface {
    constructor () {
        this.config = {
            server: '10.58.136.61',
            database: 'ah2',
            port : 1399,
            user : "ah2login",
            password : "Keppel123"
        };
    }
    
    ConnectDB(callback) {
        if (this.pool == undefined) {
            new sql.ConnectionPool(this.config).connect().then(pool => {
                this.pool = pool
                callback(pool)
            })
        } else {
            callback(this.pool)
        }
    }

    // inputs is an array of json
    // [{ 
    //     name : string,
    //     type : sql.type,
    //     value : value
    // }]
    PerformQuery(queryString, inputs, callback){
        this.ConnectDB( function(pool) {
            let req = new sql.Request(pool)
            var i, currInput
            for (i=0;i<inputs.length;i++) {
                currInput = inputs[i]
                req.input(currInput.name, currInput.type, currInput.value )
            }
            req.query(queryString, function (err, result) {
                sql.close()
                if (callback == null) {
                    return
                }
                if ( err ) {
                    console.log(err);
                    callback(null, err)
                    return
                }
                callback(result.recordset, null)
            })
        })
    }

    // inputs is an array of json
    // [{ 
    //     name : string,
    //     type : sql.type,
    //     value : value
    // }]
    ExecuteStoredProcedure(procedureName, inputs, callback) {
        this.ConnectDB( function(pool) {
            let request = new sql.Request(pool)
            var i, currInput
            for (i=0;i<inputs.length;i++) {
                currInput = inputs[i]
                request.input(currInput.name, currInput.type, currInput.value )
            }
            request.execute(procedureName).then(function(results) {
                callback(results, null);
            }).catch(function(err) {
                callback(null, err);
            });
        })
    }
}
module.exports = SqlInterface;