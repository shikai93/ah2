const axios = require('axios');

class Model {
    constructor() {
        this.apiEndPoint = "http://127.0.0.1:4001"
    }
    
    get(path, params, callback) {
        axios.get(this.apiEndPoint + path, { params : params}).then(function (res) {
            callback(res.data, null)
        }).catch(function (error) {
            console.log(error)
            callback(null, error)
        });
    }
    postReq(path, body, callback){
        axios.post(this.apiEndPoint + path,body)
        .then(function (response) {
            if (response !== null) {
                callback(response.data, null)
            }
        })
        .catch(function (error) {
            console.log(error);
            callback(null, error)
        });
    }
}
export default Model;