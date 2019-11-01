import React from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import { withRouter } from "react-router-dom";
import SpeechRecognition from "react-speech-recognition";
import SignatureCanvas from 'react-signature-canvas'

import './MaintenanceReport.css'
import { RenderForm } from '../../../Helpers/FormRenderer.js';
import {JSDateToHTMLDateString} from '../../../Helpers/Helper.js'
import APIService from "../../../Helpers/APIService.js"
class MaintenanceReport extends React.Component { 
    exporter = new PDFExporter()
    api = new APIService()
    sigCanvas = undefined
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
            deptNames : [],
            signature : undefined
        };
    }
    componentDidMount() {
        this.getVessels()
        this.getDepartments()
    }

    // MARK : Enable Speech to Text Entry of Input
    recordIdHandling = undefined
    fieldHandling = undefined
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

    addMaintenanceReport = () => {
        if (this.sigCanvas === undefined || this.sigCanvas.isEmpty()) {
            alert("Please sign off")
        }
        var curState = this.state
        curState.signature = this.sigCanvas.getTrimmedCanvas().toDataURL('image/png')
        this.exporter.CreateMaintenanceReportPDF(curState, (success) => {
            if (success) {
                this.backToMaintenanceReportDash()
            }
        })
    }
    backToMaintenanceReportDash = () => {
        this.props.history.push('/maintenance/report')
    }

    handleDataChange(event, field=null, val=null) {
        let oldState = this.state;
        if (event !== undefined) {
            field = event.target.dataset.datafield
            val = event.target.value
        }
        switch (field) {    
            case "vessel" :
                oldState.vessel = val
                break
            case "dept" :
                oldState.dept = val
                break
            case "month" :
                oldState.month = val
                break
            case "year" :
                oldState.year = val
                break
            default :
                break
        }
        this.setState(oldState)
    }
    handleRecordChange(event, field=null, id=null, val=null) {
        if (event !== undefined) {
            field = event.target.dataset.datafield
            id = event.target.dataset.id
            val = event.target.value
        }
        let oldState = this.state
        switch (field) {    
            case "date" :
                oldState.records[id].date = new Date(val)
                break
            case "description" :
                oldState.records[id].description = val
                break
            case "remarks" :
                    oldState.records[id].remarks = val
                break
            default :
                break
        }
        this.setState(oldState)
    }

    getDepartments = () => {
        this.api.GetDepts((depts) => {
            let oldState = this.state
            if (depts instanceof Array) {
                oldState.deptNames = []
                depts.forEach((elm) => {
                    oldState.deptNames.push({label : elm.name, value : elm.name})
                });
            }
            this.setState(oldState) 
        })
    }
    getVessels = () => {
        this.api.GetVessels((vessels) => {
            let oldState = this.state
            if (vessels instanceof Array) {
                oldState.vesselNames = []
                vessels.forEach((elm) => {
                    oldState.vesselNames.push({label : elm.name, value : elm.name})
                });
            }
            this.setState(oldState) 
        })
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
                        data-datafield ="date"
                        onChange={this.handleRecordChange.bind(this)} value={JSDateToHTMLDateString(record.date)}></Form.Control>
                    </Col>
                    <Col xs={4} sm={0} className="hide-on-sm">
                        <Form.Label>Description</Form.Label>
                    </Col>
                    <Col xs={8} sm={5}>
                        <Form.Control as="textarea"
                        rows="3"
                        data-id ={i}
                        onBlur={this.handleRecordBlur.bind(this)}
                        onFocus={this.handleRecordFocus.bind(this)}
                        className="recordInput"
                        data-datafield ="description"
                        onChange={this.decoratorHandleDataChange.bind(this)} value={record.description}></Form.Control>
                    </Col>
                    <Col xs={4} sm={0} className="hide-on-sm">
                        <Form.Label>Remarks</Form.Label>
                    </Col>
                    <Col xs={8} sm={3} className="verticalCenter"> 
                        <Form.Control type="textarea"
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
        var formDataTop = {
            fields : [{
                label : "Vessel",
                value : this.state.vessel,
                type : "select",
                datafield : "vessel",
                onChange : this.handleDataChange.bind(this),
                options : this.state.vesselNames
            },{
                label : "Dept",
                value : this.state.dept,
                type : "select",
                datafield : "dept",
                onChange : this.handleDataChange.bind(this),
                options : this.state.deptNames
            },{
                label : "Month",
                value : this.state.month,
                type : "select",
                datafield : "month",
                onChange : this.handleDataChange.bind(this),
                options : [
                    {label : "JANUARY", value : "JANUARY"},
                    {label : "FEBRUARY", value : "FEBRUARY"},
                    {label : "MARCH", value : "MARCH"},
                    {label : "APRIL", value : "APRIL"},
                    {label : "MAY", value : "MAY"},
                    {label : "JUNE", value : "JUNE"},
                    {label : "JULY", value : "JULY"},
                    {label : "AUGUST", value : "AUGUST"},
                    {label : "SEPTEMBER", value : "SEPTEMBER"},
                    {label : "OCTOBER", value : "OCTOBER"},
                    {label : "NOVEMBER", value : "NOVEMBER"},
                    {label : "DECEMBER", value : "DECEMBER"},
                ]
            },{
                label : "Year",
                value : this.state.year,
                type : "number",
                datafield : "year",
                onChange : this.handleDataChange.bind(this),
            }]
        }
        return (
        <Container>
            <Row>
                <Col style={{textAlign : 'center'}} >
                    <h1 className="formHeader1">Machinery Maintenance Report</h1>
                </Col>
            </Row>
            <Row className="formContents">
                 <Col xs={12} sm={{span : 10, offset : 1}}>
                     {RenderForm(formDataTop)}
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
                 </Col>
            </Row>
            <Row>
                <Col xs={12} sm={{span : 11}} style={{textAlign : "right", marginTop : '30px'}}>
                <SignatureCanvas 
                    canvasProps={{width: 300, height: 100, className: 'sigCanvas'}} 
                    ref={(ref) => { this.sigCanvas = ref }} />,
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

const options = {
    autoStart: false,
    continuous : false
}
export default SpeechRecognition(options)(withRouter(MaintenanceReport));