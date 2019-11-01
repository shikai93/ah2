import Model from '../../Models/Models.js'

class AttendanceAPI extends Model{
    LogAttendance = (date, attendees, meeting, callback) => {
        var csvStr = ""
        if (attendees instanceof Array) {
            csvStr = attendees.join(",")
        }
        let data = {
            attendanceDate : date,
            attendees : csvStr,
            meeting : meeting
        }
        super.postReq('/attendance/new' , data, (value,error) => {
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
export default AttendanceAPI;