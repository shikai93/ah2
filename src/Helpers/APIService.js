import Model from '../Models/Models.js'

class APIService extends Model{
    GetVessels = (callback) => {
        super.get("/vessels", {} , (vessels, error) => {
            if (error == null) {
                callback(vessels.value)
            } else {
                callback([])
            }
        })
    }
    GetDepts = (callback) => {
        super.get("/departments", {} , (depts, error) => {
            if (error == null) {
                callback(depts.value)
            } else {
                callback([])
            }
        })
    }
}
export default APIService;