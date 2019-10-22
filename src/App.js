import React from 'react';
import './App.css';
import { Container, Col, Row} from 'react-bootstrap';
import {AuthProvider} from './Helpers/auth/auth.js';
import PrivateRoute from './Helpers/auth/privateRoute.js';
import { BrowserRouter as Router, Route } from "react-router-dom";
import PDFExportForm from './Components/PDFExportForm/PDFExportForm.js'
import MaintenanceReport from "./Components/PDFExportForm/MaintenanceReport/MaintenanceReport.js"
import MaintenanceReports from "./Components/PDFExportForm/MaintenanceReport/MainenanceReports.js"
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
            <AuthProvider>
              <Router>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" render={() => (
                      <LoginPage></LoginPage>
                )}/>
                <PrivateRoute exact path="/maintenance/report/new" component={MaintenanceReportNewPage} />
                <PrivateRoute exact path="/maintenance/report" component={MaintenanceReportPage} />
              </Router>
            </AuthProvider>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function Home() {
  return (
    <PDFExportForm>Hello</PDFExportForm>
  )
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
