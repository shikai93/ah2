const sql = require('mssql')
"use strict";
class AttendanceAPIService {
    constructor (sqlInterface) {
        this.sqlInterface = sqlInterface
    }
    MarkAttendance(data,callback) {
        this.sqlInterface.PerformQuery(
            "INSERT INTO Attendance (AttendaneDate, Attendees, Meeting) VALUES (@date, @attendees, @meeting);",
            [{ 
                name : 'date',
                type : sql.Date,
                value : data.attendanceDate
            },{
                name : 'attendees',
                type : sql.VarChar(sql.MAX),
                value : data.attendees
            },{
                name : 'meeting',
                type : sql.VarChar(255),
                value : data.meeting
            }],
            (recordset, error) => {
                callback("attendance taken", error)
            })
    }
}
module.exports = AttendanceAPIService;