import React from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import { withRouter } from "react-router-dom";

import './MaintenanceReport.css'
class MaintenanceReport extends React.Component { 
    exporter = new PDFExporter()
    constructor(props, context) {
        super(props, context)
        this.state={ 
            vessel : "ASIAN HERCULES II",
            dept : "KOMDIGI",
            month : "OCTOBER",
            year : 2019,
            records : [
                {
                    date : new Date(),
                    description : 'Completed created draft of report',
                    remarks : 'Good Job'
                }
            ],
            vesselNames : [],
            deptNames : []
        };
    }
    componentDidMount() {
        this.getVessels()
        this.getDepartments()
    }
    handleVesselChange(event) {
        let val = event.target.value;
        let oldState = this.state
        oldState.vessel = val
        this.setState(oldState)
    }
    handleDeptChange(event) {
        let val = event.target.value;
        let oldState = this.state
        oldState.dept = val
        this.setState(oldState)
    }
    handleMonthChange(event) {
        let val = event.target.value;
        let oldState = this.state
        oldState.month = val
        this.setState(oldState)
    }
    handleYearChange(event) {
        let val = event.target.value;
        let oldState = this.state
        oldState.year = val
        this.setState(oldState)
    }
    handleRecordDateChange(event) {
        let val = event.target.value;
        let id = event.target.dataset.id;
        let oldState = this.state
        oldState.records[id].date = new Date(val)
        this.setState(oldState)
    }
    handleRecordDescripChange(event) {
        let val = event.target.value;
        let id = event.target.dataset.id;
        let oldState = this.state
        oldState.records[id].description = val
        this.setState(oldState)
    }
    handleRemarksChange(event) {
        let val = event.target.value;
        let id = event.target.dataset.id;
        let oldState = this.state
        oldState.records[id].remarks = val
        this.setState(oldState)
    }
    addRecord = () => {
        let oldState = this.state
        oldState.records.push({
            date : new Date(),
            description : '',
            remarks : ''
        })
        this.setState(oldState) 
    }
    removeRecord = (event) => {
        let id = event.target.dataset.id;
        let oldState = this.state
        oldState.records.splice(id,1)
        this.setState(oldState) 
    }
    JSDateToHTMLDateString = (JSDate) => {
        var datestring = JSDate.getFullYear()+'-'+ ("0"+(JSDate.getMonth()+1)).slice(-2) +'-'+ ("0" + JSDate.getDate()).slice(-2)
        return datestring
    }
    addMaintenanceReport = () => {
        this.exporter.CreateMaintenanceReportPDF(this.state, (success) => {
            if (success) {
                this.backToMaintenanceReportDash()
            }
        })
    }
    backToMaintenanceReportDash = () => {
        this.props.history.push('/maintenance/report')
    }

    getDepartments = () => {
        this.exporter.get("/departments", {} , (depts, error) => {
            if (error == null) {
                let oldState = this.state
                oldState.deptNames = depts.value
                this.setState(oldState) 
            }
        })
    }
    renderDepartments = () => {
        var departments = []
        for (var i=0; i < this.state.deptNames.length; i++) {
            var name = this.state.deptNames[i].name
            departments.push(
                <option key={i} value={name}>{name}</option>
            )
        }
        return departments
    }
    getVessels = () => {
        this.exporter.get("/vessels", {} , (vessels, error) => {
            if (error == null) {
                let oldState = this.state
                oldState.vesselNames = vessels.value
                this.setState(oldState) 
            }
        })
    }
    renderVessels = () => {
        var vesselNames = []
        for (var i=0; i < this.state.vesselNames.length; i++) {
            var name = this.state.vesselNames[i].name
            vesselNames.push(
                <option key={i} value={name}>{name}</option>
            )
        }
        return vesselNames
    }
    renderRecords = () => {
        var recordElms = []
        for (var i=0; i < this.state.records.length; i++) {
            var record = this.state.records[i]
            recordElms.push(
                <Form.Row key={i} style={{marginTop : '20px', marginBottom : '20px'}}>
                    <Col xs={4} sm={0} className="hide-on-sm">
                        <Form.Label>Date</Form.Label>
                    </Col>
                    <Col xs={8} sm={3} className="verticalCenter">
                        <Form.Control type="date" min="1990"
                        className="recordInput"
                        data-id ={i}
                        onChange={this.handleRecordDateChange.bind(this)} value={this.JSDateToHTMLDateString(record.date)}></Form.Control>
                    </Col>
                    <Col xs={4} sm={0} className="hide-on-sm">
                        <Form.Label>Description</Form.Label>
                    </Col>
                    <Col xs={8} sm={5}>
                        <Form.Control as="textarea"
                        rows="3"
                        data-id ={i}
                        className="recordInput"
                        onChange={this.handleRecordDescripChange.bind(this)} value={record.description}></Form.Control>
                    </Col>
                    <Col xs={4} sm={0} className="hide-on-sm">
                        <Form.Label>Remarks</Form.Label>
                    </Col>
                    <Col xs={8} sm={3} className="verticalCenter"> 
                        <Form.Control type="textarea"
                            className="recordInput"
                            data-id ={i}
                            onChange={this.handleRemarksChange.bind(this)} value={record.remarks} />
                    </Col>
                    <Col xs={{span : 1, offset : 11}} sm={{span : 1, offset : 0}} 
                    style={{textAlign : 'center', marginTop : 'auto', marginBottom : 'auto'}}
                    className="exta-top-margin-on-small">
                        <Button data-id ={i} variant='danger' 
                        style={{padding : '0 .4rem'}} 
                        onClick={this.removeRecord}>x</Button>
                    </Col>
                </Form.Row>
            )
        }
        return recordElms
    }
    render() { 
        return (
        <Container>
            <Row>
                <Col style={{textAlign : 'center'}} >
                    <h1 className="formHeader1">Machinery Maintenance Report</h1>
                </Col>
            </Row>
            <Row className="formContents">
                 <Col xs={12} sm={{span : 10, offset : 1}}>
                     <Form>
                        <Form.Group controlId="formVessel" >
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Vessel : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control as="select"
                                defaultValue={this.state.vessel}
                                onChange={this.handleVesselChange.bind(this)} >
                                    {this.renderVessels()}
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formDept">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Dept : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control as="select"
                                defaultValue={this.state.dept}
                                onChange={this.handleDeptChange.bind(this)}>
                                    {this.renderDepartments()}
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formMonth">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Month : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control as="select" 
                                onChange={this.handleMonthChange.bind(this)}  
                                defaultValue={this.state.month}>
                                    <option value="JANUARY">JANUARY</option>
                                    <option value="FEBRUARY">FEBRUARY</option>
                                    <option value="MARCH">MARCH</option>
                                    <option value="APRIL">APRIL</option>
                                    <option value="MAY">MAY</option>
                                    <option value="JUNE">JUNE</option>
                                    <option value="JULY">JULY</option>
                                    <option value="AUGUST">AUGUST</option>
                                    <option value="SEPTEMBER">SEPTEMBER</option>
                                    <option value="OCTOBER">OCTOBER</option>
                                    <option value="NOVEMBER">NOVEMBER</option>
                                    <option value="DECEMBER">DECEMBER</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formYear">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Year : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="number" min="1990" ref="year" 
                                onChange={this.handleYearChange.bind(this)} value={this.state.year}></Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formRecords">
                        <Form.Row style={{marginTop : '40px', marginBottom : '10px'}}>
                            <Col style={{textAlign : 'center'}}>
                                <h2>Records </h2>
                            </Col>
                        </Form.Row>
                        <Form.Row style={{textAlign : "center", fontSize : '1rem', fontWeight : 600}}>
                            <Col xs={3} className="hide-on-xs">Date</Col>
                            <Col xs={5} className="hide-on-xs">Description Of Maintenance Job Carried Out</Col>
                            <Col xs={3} className="hide-on-xs">Remarks <br/>(For Official Use)</Col>
                            <Col xs={{span : 1, offset : 11}} sm={1}> <Button variant='info' onClick={this.addRecord} style={{padding : '0 .4rem'}}>+</Button></Col>
                        </Form.Row>
                        {this.renderRecords()}
                        </Form.Group>
                    </Form>
                 </Col>
            </Row>
            <Row>
                <Col xs={12} sm={{span : 11}} style={{textAlign : "right", marginTop : '30px'}}>
                    <Button variant="secondary" onClick={this.backToMaintenanceReportDash} style={{marginRight : '10px'}}>Back</Button>
                    <Button variant="primary" onClick={this.addMaintenanceReport}>Save</Button>
                </Col>
            </Row>
            <Row style={{paddingBottom : '50px'}}>
                <Col>
                </Col>
            </Row>
        </Container>
    )}
}
export default withRouter(MaintenanceReport);