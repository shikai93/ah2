import React from 'react';
import './App.css';
import { Container, Col, Row} from 'react-bootstrap';
import {AuthProvider} from './Helpers/auth/auth.js';
import PrivateRoute from './Helpers/auth/privateRoute.js';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Components/Pages/Home.js'
import MaintenanceReport from "./Components/PDFExportForm/MaintenanceReport/MaintenanceReport.js"
import MaintenanceReports from "./Components/PDFExportForm/MaintenanceReport/MainenanceReports.js"
import WeeklyDefect from "./Components/PDFExportForm/WeeklyDefects/WeeklyDefect.js"
import WeeklyDefects from "./Components/PDFExportForm/WeeklyDefects/WeeklyDefects.js"
import DailyBunkerRecords from "./Components/PDFExportForm/DailyBunkerRecord/DailyBunkerRecords.js"
import DailyBunkerRecord from "./Components/PDFExportForm/DailyBunkerRecord/DailyBunkerRecord.js"
import Attendance from "./Components/Attendance/Attendance.js"
import SignPage from "./Components/PDFExportForm/SignIn/Signin"
import LoginPage from "./Components/Auth/login.js"
function App() {
  return (
    <div className="App">
      <Container>
        <Row className="topHeader">
          <Col>
          </Col>
        </Row>
        <Row className="contentContainer">
          <Col>
            <Router>
              <SignPage></SignPage>
            </Router>
           
            {/* <AuthProvider>
              <Router>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" render={() => (
                      <LoginPage></LoginPage>
                )}/>
                <PrivateRoute exact path="/maintenance/report/new" component={MaintenanceReportNewPage} />
                <PrivateRoute exact path="/maintenance/report" component={MaintenanceReportPage} />
                <PrivateRoute exact path="/weeklydefect/report/new" component={WeeklyDefect} />
                <PrivateRoute exact path="/weeklydefect/report" component={WeeklyDefects} />
                <PrivateRoute exact path="/dailybunker/report/new" component={DailyBunkerRecord} />
                <PrivateRoute exact path="/dailybunker/report" component={DailyBunkerRecords} />
                <PrivateRoute exact path="/attendance" component={Attendance} />
              </Router>
            </AuthProvider> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function MaintenanceReportPage() {
  return (
    <MaintenanceReports></MaintenanceReports>
  )
}
function MaintenanceReportNewPage() {
  return (
    <MaintenanceReport></MaintenanceReport>
  )
}
export { App } ;
