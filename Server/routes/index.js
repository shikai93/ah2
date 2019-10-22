const express = require("express");
const API = require("../api.js");
const router = express.Router();
const api = new API()

callback = (res,value,err) => {
  if (err === null) {
    res.send({ success: true, value : value }).status(200);
  } else {
    console.log(err)
    res.send({ success: false, error : err }).status(500);
  }
}

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.post("/pdf/create", (req, res) => {
  // let tagname = req.body.tagname
  api.CreateForm((value,err) => {
    callback(res,value,err)
  })
});

// router.get("/pdf/maintenanereport", (req, res) => {
//   res.send({ response: "I am alive" }).status(200);
// });
router.post("/pdf/maintenanereport/create", (req, res) => {
  let vessel = req.body.vessel
  let dept = req.body.dept
  let month = req.body.month
  let year = req.body.year
  let records = req.body.records
  var docData = {
    vessel : vessel,
    dept : dept,
    month : month,
    year : year,
    records : records
  }
  api.CreateMaintenanceReport(docData, (value, err) => {
    callback(res,value,err)
  })
});

router.get("/departments", (req, res) => {
  api.GetDepartments( (value, err) => {
    callback(res,value,err)
  })
});
router.get("/vessels", (req, res) => {
  api.GetVessels( (value, err) => {
    callback(res,value,err)
  })
});
router.get("/maintenanceReport", (req, res) => {
  api.GetMaintenanceReport( (value, err) => {
    callback(res,value,err)
  })
});
module.exports = router;

