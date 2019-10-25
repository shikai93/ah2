import React from 'react';
import { Container, Row, Col, Button, Table} from 'react-bootstrap'
import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import { withRouter } from "react-router-dom";
import '../style.css'
class DailyBunkerRecords extends React.Component { 
    exporter = new PDFExporter()
    constructor(props, context) {
        super(props, context);
        this.state = {
            reports : []
        }
    }
    addReport = () => {
        this.props.history.push("/dailybunker/report/new");
    }
    toHome = () => {
        this.props.history.push("/");
    }
    JSDateToHTMLDateString = (JSDate) => {
        if (JSDate === undefined || !JSDate.getFullYear) {
            return ""
        }
        var datestring = JSDate.getFullYear()+'-'+ ("0"+(JSDate.getMonth()+1)).slice(-2) +'-'+ ("0" + JSDate.getDate()).slice(-2)
        return datestring
    }
    componentDidMount() {
        this.getReports()
    }
    getReports() {
        this.exporter.get("/dailybunker", {} , (resp, error) => {
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
            var date = new Date(report.reportDate)
            reports.push(
                <tr key={i}>
                    <td>{this.JSDateToHTMLDateString(date)}</td>
                    <td>{report.vessel}</td>
                    <td>{report.ROB}</td>
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
                    <h1>Daily Bunker, Lubricants & Fresh water Status Records</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={{span: 12}} sm={{span:10, offset:1}}>
                    <Table className="full-width-on-small"  striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vessel</th>
                                <th>ROB</th>
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
                    <Button variant="primary" onClick={this.addReport}>Add New Report</Button>
                </Col>
            </Row>
            
        </Container>
    )}
}
export default withRouter(DailyBunkerRecords);