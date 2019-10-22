import React from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap'
import PDFExporter from '../../Helpers/PDFExporter/PDFExporter.js'
// Props
// title = string
// options= { key : string}
// id = string
// onSelect = (key, event) => {}
class PDFExportForm extends React.Component {
    exporter = new PDFExporter()

    ViewPDF = () => {
        this.exporter.ToPDF()
    }
    toMaintenanceReports = () => {
        this.props.history.push("/maintenance/report");
    }
    render() { return (
        <Container>
            <Row>
                <Col>{this.props.children}</Col>
            </Row>
            <Row className="buttonRow">
                <Col xs={{span: 4, offset : 8}}>
                    <Button variant="secondary" onClick={this.ViewPDF}>View PDF</Button>
                    <Button variant="primary" onClick={this.toMaintenanceReports}>View Maintenance Reports</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div id="pdf"></div>
                </Col>
            </Row>
        </Container>
    )}
}

export default withRouter(PDFExportForm);
