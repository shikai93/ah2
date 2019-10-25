import React from 'react';
import { Container, Row, Col, Button, Table} from 'react-bootstrap'
import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import { withRouter } from "react-router-dom";
import './MaintenanceReport.css'
class MaintenanceReports extends React.Component { 
    exporter = new PDFExporter()
    constructor(props, context) {
        super(props, context);
        this.state = {
            reports : []
        }
    }
    toHome = () => {
        this.props.history.push("/");
    }
    addMaintenanceReport = () => {
        this.props.history.push("/maintenance/report/new");
    }
    componentDidMount() {
        this.getMaintenanceReports()
    }
    getMaintenanceReports() {
        this.exporter.get("/maintenanceReport", {} , (resp, error) => {
            if (error == null) {
                let oldState = this.state
                var reports = resp.value
                oldState.reports = reports
                this.setState(oldState) 
            }
        })
    }
    renderReports() {
        var reports = []
        for (var i=0; i < this.state.reports.length; i++) {
            var report = this.state.reports[i]
            var fullpath = this.exporter.apiEndPoint + report.filepath
            reports.push(
                <tr key={i}>
                    <td>{report.year}</td>
                    <td>{report.month}</td>
                    <td>{report.vessel} : {report.dept}</td>
                    <td> <a href={fullpath} target='blank'>PDF</a></td>
                </tr>
            )
        }
        return reports 
    }
    render() { return (
        <Container>
            <Row className="dashHead">
                <Col>
                    <h1>Machinery Maintenance Report</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={{span: 12}} sm={{span:10, offset:1}}>
                    <Table className="full-width-on-small"  striped bordered hover>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Month</th>
                                <th>Vessel</th>
                                <th>File</th>
                            </tr>
                        </thead>
                        <tbody style={{maxHeight : '100%', overflowY : 'scroll'}}  className="smaller-font-on-small-device">
                            {this.renderReports()}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={{span : 10, offset : 1}} style={{textAlign : 'right'}}>
                    <Button variant="info" onClick={this.toHome} style={{marginRight : '15px'}}>Home</Button>
                    <Button variant="primary" onClick={this.addMaintenanceReport}>Add New Report</Button>
                </Col>
            </Row>
            
        </Container>
    )}
}
export default withRouter(MaintenanceReports);