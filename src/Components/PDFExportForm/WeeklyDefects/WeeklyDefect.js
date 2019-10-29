import React from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import { withRouter } from "react-router-dom";
import SpeechRecognition from "react-speech-recognition";

import './WeeklyDefect.css'
import './../MaintenanceReport/MaintenanceReport.css'
class WeeklyDefect extends React.Component { 
    exporter = new PDFExporter()
    recordIdHandling = undefined
    fieldHandling = undefined
    constructor(props, context) {
        super(props, context)
        var initDate = new Date()
        this.state={ 
            vessel : "ASIAN HERCULES II",
            dept : "KOMDIGI",
            reportedDate : initDate,
            master : "Ng Shi Kai",
            records : [
                {
                    completionDate : initDate,
                    description : 'Completed created draft of report',
                    prno : '',
                    wrno : '',
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        let id = this.recordIdHandling;
        let field = this.fieldHandling;
        if (nextProps.transcript === "" || nextProps.transcript === this.props.transcript) {
            return
        }
        if (id === undefined) {
            this.handleDataChange(undefined, field, nextProps.transcript)
        } else {
            this.handleRecordChange(undefined, field, id, nextProps.transcript)
        }
    }
    
    handleDataChange(event, dataFieldAffected = null, val = null) {
        if (event !== undefined) {
            dataFieldAffected = event.target.dataset.datafield
            val = event.target.value;
        }
        let oldState = this.state;
        switch (dataFieldAffected) {    
            case "vessel" :
                oldState.vessel = val
                break
            case "dept" : 
                oldState.dept = new Date(val)
                break
            case "reportedDate" : 
                oldState.reportedDate = new Date(val)
                break
            case "master" :
                oldState.master = val
                break
            default :
                break
        }
        this.setState(oldState)
    }
    handleRecordChange(event, dataFieldAffected = null, id = null, val =  null) {
        if (event !== undefined) {
            dataFieldAffected = event.target.dataset.datafield
            id = event.target.dataset.id;
            val = event.target.value;
        }
        let oldState = this.state;
        switch (dataFieldAffected) {    
            case "description" :
                oldState.records[id].description = val
                break
            case "completionDate" : 
                oldState.records[id].completionDate = new Date(val)
                break
            case "prno" : 
                oldState.records[id].prno = val
                break
            case "wrno" : 
                oldState.records[id].wrno = val
                break
            case "remarks" :
                oldState.records[id].remarks = val
                break
            default :
                break
        }
        this.setState(oldState)
    }
    handleRecordFocus(event) {
        this.fieldHandling = event.target.dataset.datafield
        this.recordIdHandling = event.target.dataset.id
        this.props.startListening();
    }

    handleRecordBlur(event) {
        this.props.stopListening();
    }
    decoratorHandleDataChange(event){
        let field = event.target.dataset.datafield
        let id = event.target.dataset.id
        let val = event.target.value
        if (id === undefined) {
            this.handleDataChange(undefined, field, val)
        } else {
            this.handleRecordChange(undefined, field, id, val)
        }
    }

    addRecord = () => {
        let oldState = this.state
        oldState.records.push({
            completionDate : new Date(),
            description : '',
            prno : '',
            wrno : '',
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
        if (JSDate === undefined || !JSDate.getFullYear) {
            return ""
        }
        var datestring = JSDate.getFullYear()+'-'+ ("0"+(JSDate.getMonth()+1)).slice(-2) +'-'+ ("0" + JSDate.getDate()).slice(-2)
        return datestring
    }
    addWeeklyDefect = () => {
        this.exporter.CreateWeeklyDefectPDF(this.state, (success) => {
            if (success) {
                this.backToWeeklyDefecttDash()
            }
        })
    }
    backToWeeklyDefecttDash = () => {
        this.props.history.push('/weeklydefect/report')
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
                <Form.Row key={i} style={{marginTop : '20px', marginBottom : '20px', fontSize : '.8rem'}}>
                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Defect Description</Form.Label>
                    </Col>
                    <Col xs={8} sm={4}>
                        <Form.Control as="textarea"
                        rows="3"
                        data-id ={i}
                        data-datafield ="description"
                        className="recordInput"
                        onBlur={this.handleRecordBlur.bind(this)}
                        onFocus={this.handleRecordFocus.bind(this)}
                        onChange={this.decoratorHandleDataChange.bind(this)} value={record.description}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Expected Completion Date</Form.Label>
                    </Col>
                    <Col xs={8} sm={2} className="verticalCenter">
                        <Form.Control type="date" min="1990"
                        className="recordInput"
                        data-id ={i}
                        data-datafield ="completionDate"
                        onChange={this.handleRecordChange.bind(this)} value={this.JSDateToHTMLDateString(record.completionDate)}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Purchased Requisition Number</Form.Label>
                    </Col>
                    <Col xs={8} sm={1} className="verticalCenter">
                        <Form.Control type="number"
                        className="recordInput"
                        data-id ={i}    
                        data-datafield ="prno"
                        onBlur={this.handleRecordBlur.bind(this)}
                        onFocus={this.handleRecordFocus.bind(this)}
                        onChange={this.decoratorHandleDataChange.bind(this)} value={record.prno}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Work Requisition Number</Form.Label>
                    </Col>
                    <Col xs={8} sm={1} className="verticalCenter">
                        <Form.Control type="number"
                        className="recordInput"
                        data-id ={i}
                        data-datafield ="wrno"
                        onBlur={this.handleRecordBlur.bind(this)}
                        onFocus={this.handleRecordFocus.bind(this)}
                        onChange={this.decoratorHandleDataChange.bind(this)} value={record.wrno}></Form.Control>
                    </Col>
                    
                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Remarks</Form.Label>
                    </Col>
                    <Col xs={8} sm={3} className="verticalCenter"> 
                        <Form.Control as="textarea"
                            className="recordInput"
                            data-id ={i}
                            data-datafield ="remarks"
                            onBlur={this.handleRecordBlur.bind(this)}
                            onFocus={this.handleRecordFocus.bind(this)}
                            onChange={this.decoratorHandleDataChange.bind(this)} value={record.remarks} />
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
                    <h1 className="formHeader1">Weekly Defect Records</h1>
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
                                data-datafield ="vessel"
                                onChange={this.handleDataChange.bind(this)} >
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
                                data-datafield ="dept"
                                onChange={this.handleDataChange.bind(this)}>
                                    {this.renderDepartments()}
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formReportedDate">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Reported Date : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="date" min="1990"
                                data-datafield ="reportedDate"
                                onChange={this.handleDataChange.bind(this)}  
                                defaultValue={this.JSDateToHTMLDateString(this.state.reportedDate)}>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formMaster">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Master : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="text"
                                data-datafield ="master"
                                onBlur={this.handleRecordBlur.bind(this)}
                                onFocus={this.handleRecordFocus.bind(this)}
                                onChange={this.decoratorHandleDataChange.bind(this)} value={this.state.master}></Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>
                    </Form>
                 </Col>
            </Row>
            <Row style={{marginLeft:'-15px', marginRight : '-15px'}}>
                <Col>
                    <Form.Group controlId="formRecords">
                        <Form.Row style={{marginTop : '40px', marginBottom : '10px'}}>
                            <Col style={{textAlign : 'center'}}>
                                <h2>Records </h2>
                            </Col>
                        </Form.Row>
                        <Form.Row style={{textAlign : "center", fontSize : '.8rem', fontWeight : 600}}>
                            <Col xs={4} className="hide-on-xs">Defect Description</Col>
                            <Col xs={2} className="hide-on-xs">Expected<br/>Completion Date</Col>
                            <Col xs={1} className="hide-on-xs">Purchased <br/>Requisition <br/>Number</Col>
                            <Col xs={1} className="hide-on-xs">Work <br/>Requisition <br/>Number</Col>
                            <Col xs={3} className="hide-on-xs">Remarks/ Status</Col>
                            <Col xs={{span : 1, offset : 11}} sm={{span : 1, offset: 0}}> <Button variant='info' onClick={this.addRecord} style={{padding : '0 .4rem'}}>+</Button></Col>
                        </Form.Row>
                        {this.renderRecords()}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={{span : 11}} style={{textAlign : "right", marginTop : '30px'}}>
                    <Button variant="secondary" onClick={this.backToWeeklyDefecttDash} style={{marginRight : '10px'}}>Back</Button>
                    <Button variant="primary" onClick={this.addWeeklyDefect}>Save</Button>
                </Col>
            </Row>
            <Row style={{paddingBottom : '50px'}}>
                <Col>
                </Col>
            </Row>
        </Container>
    )}
}
const options = {
    autoStart: false,
    continuous : false
}
export default SpeechRecognition(options)(withRouter(WeeklyDefect));