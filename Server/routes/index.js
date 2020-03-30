const express = require("express");
const API = require("../api.js");
const router = express.Router();
const api = new API()

callback = (res,value,err) => {
  if (err === null) {
    res.send({ success: true, value : value }).status(200);
  } else {
    console.log(res,value,err)
    res.send({ success: false, error : err }).status(500);
  }
}

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

// LOGIN ROUTES
router.post("/login", (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (username == null || password == null ) {
    res.send({ success: false, error : "Missing Credentials" }).status(500);
    return
  }
  api.Login(username, password, (value, err) => {
    callback(res,value,err)
  })
})
router.post("/token/verify", (req, res) => {
  let userId = req.body.userId
  let token = req.body.token
  if (userId == null || token == null ) {
    res.send({ success: false, error : "Missing Credentials" }).status(500);
    return
  }
  api.VerifyToken(userId, token, (value, err) => {
    callback(res,value,err)
  })
})
// Digi Opening
router.post("/pdf/congratulations/create", (req, res) => {
  let signature = req.body.signature
  var docData = {
    signature : signature
  }
  api.CreateCongratulationNote(docData, (value, err) => {
    callback(res,value,err)
  })
});

// MAINTENANCE REPORT ROUTES
router.post("/pdf/maintenanereport/create", (req, res) => {
  let vessel = req.body.vessel
  let dept = req.body.dept
  let month = req.body.month
  let year = req.body.year
  let records = req.body.records
  let signature = req.body.signature
  var docData = {
    vessel : vessel,
    dept : dept,
    month : month,
    year : year,
    records : records,
    signature : signature
  }
  api.CreateMaintenanceReport(docData, (value, err) => {
    callback(res,value,err)
  })
});
router.get("/maintenanceReport", (req, res) => {
  api.GetMaintenanceReport( (value, err) => {
    callback(res,value,err)
  })
});

// WEEKLY DEFECT RECORD ROUTES
router.post("/pdf/weeklydefect/create", (req, res) => {
  let vessel = req.body.vessel
  let dept = req.body.dept
  let reportedDate = req.body.reportedDate
  let master = req.body.master
  let records = req.body.records
  var docData = {
    vessel : vessel,
    dept : dept,
    reportedDate : new Date(reportedDate),
    master : master,
    records : records
  }
  api.CreateWeeklyDefect(docData, (value, err) => {
    callback(res,value,err)
  })
});
router.get("/weeklyDefects", (req, res) => {
  api.GetWeeklyDefect( (value, err) => {
    callback(res,value,err)
  })
});

// DAILY BUNKER RECORD ROUTES
router.post("/pdf/dailybunker/create", (req, res) => {
  let vessel = req.body.vessel
  let reportDate = req.body.reportDate
  let lastBunkerDate = req.body.lastBunkerDate
  let lastBunkerQuantity = req.body.lastBunkerQuantity
  let chiefEngineerName = req.body.chiefEngineerName
  let bunkerROB = req.body.bunkerROB
  let isMGO = ((req.body.isMGO) ? 1 : 0);
  let isLO = ((req.body.isLO) ? 1 : 0);
  let isFW = ((req.body.isFW) ? 1 : 0);
  let records = req.body.records
  let signature = req.body.signature
  var docData = {
    vessel : vessel,
    reportDate : new Date(reportDate),
    lastBunkerDate: new Date(lastBunkerDate),
    lastBunkerQuantity : lastBunkerQuantity,
    chiefEngineerName : chiefEngineerName,
    bunkerROB : bunkerROB,
    isMGO : isMGO,
    isLO : isLO,
    isFW : isFW,
    records : records,
    signature : signature
  }
  api.CreateDailyBunkerRecord(docData, (value, err) => {
    callback(res,value,err)
  })
});
router.get("/dailybunker", (req, res) => {
  api.GetDailyBunkerRecords( (value, err) => {
    callback(res,value,err)
  })
});

// ATTENDANCE ROUTE
router.post("/attendance/new", (req, res) => {
  let attendanceDate = req.body.attendanceDate
  let attendeesCSV = req.body.attendees
  let meeting = req.body.meeting
  var docData = {
    attendanceDate : new Date(attendanceDate),
    attendees: attendeesCSV,
    meeting : meeting
  }
  api.MarkAttendance(docData, (value, err) => {
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

module.exports = router;

