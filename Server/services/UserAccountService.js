const crypto = require("crypto");
const sql = require('mssql')
"use strict";
const USERTABLE = 'UserAccount'
class UserAccountService {
    constructor (sqlInterface) {
        this.sqlInterface = sqlInterface
    }
    GetSaltAndPw(username,callback) {
        if (typeof(username) != "string" ) {
            callback(null,"Invalid username submitted")
            return
        }
        this.sqlInterface.PerformQuery(
            `SELECT salt, password, id FROM ${USERTABLE} WHERE username=@user`,
            [{ 
                name : 'user',
                type : sql.VarChar(255),
                value : username
            }],
            (recordset, error) => {
                if (recordset.length === 0) {
                    callback(null, "No such user found!")
                    return
                }
                callback(recordset[0], null)
            }
        )
    }
    UpdateAuthenticationToken(userId, newToken) {
        this.sqlInterface.PerformQuery(
            `UPDATE ${USERTABLE} SET authenticationToken = @token WHERE id=@id`,
            [{ 
                name : 'id',
                type : sql.Int,
                value : userId
            },{ 
                name : 'token',
                type : sql.VarChar(255),
                value : newToken
            }],
            null
        )
    }
    
    Login(username, password, callback) {
        // retrieve salt
        const hmac = crypto.createHmac('sha256', '89a75tsf3djvn');
        this.GetSaltAndPw(username,(values,error) => {
            if (error != null) {
                callback(false,error)
            } else {
                // sha256 password
                hmac.update(password + values.salt);
                const hashed =  hmac.digest('hex')
                if (values.password === hashed) {
                    // generate token
                    var token = crypto.randomBytes(64).toString('hex');
                    this.UpdateAuthenticationToken(values.id, token)
                    callback({userId : values.id, token : token}, null)
                } else {
                    callback(false,"Invalid Password")
                }
            }
        }) 
    }
    VerifyToken(userId, token, callback){
        this.sqlInterface.PerformQuery(
            `SELECT * FROM ${USERTABLE} WHERE id=@id AND authenticationToken = @token`,
            [{ 
                name : 'id',
                type : sql.Int,
                value : userId
            },{ 
                name : 'token',
                type : sql.VarChar(255),
                value : token
            }],
            (recordset, error) => {
                if (recordset.length === 0) {
                    callback(false, "Authentication failed!")
                } else {
                    callback(true, null)
                }
            }
        )
    }
}
module.exports = UserAccountService;