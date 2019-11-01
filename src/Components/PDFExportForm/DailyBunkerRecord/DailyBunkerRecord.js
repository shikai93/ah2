import React from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import { withRouter } from "react-router-dom";

import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import {RenderForm} from '../../../Helpers/FormRenderer.js'
import {JSDateToHTMLDateString} from '../../../Helpers/Helper.js'
import APIService from "../../../Helpers/APIService.js"

import SpeechRecognition from "react-speech-recognition";
import SignatureCanvas from 'react-signature-canvas'

import '../style.css'
class DailyBunkerRecord extends React.Component { 
    exporter = new PDFExporter()
    sigCanvas = undefined
    api = new APIService()
    constructor(props, context) {
        super(props, context)
        var initDate = new Date()
        this.state={ 
            vessel : "ASIAN HERCULES II",
            reportDate : initDate,
            lastBunkerDate: initDate,
            lastBunkerQuantity : 0,
            chiefEngineerName : "Ng Shi Kai",
            bunkerROB : "AND1238SD1",
            isMGO : true,
            isLO : false,
            isFW : false,
            records : [
            ],
            vesselNames : [],
            signature : undefined
        };
    }
    componentDidMount() {
        this.getVessels()
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

    handleDataChange(event, dataFieldAffected = null, val = null) {
        if (event !== undefined) {
            dataFieldAffected = event.target.dataset.datafield
            val = event.target.value
        }
        let oldState = this.state;
        switch (dataFieldAffected) {    
            case "vessel" :
                oldState.vessel = val
                break
            case "reportDate" :
                oldState.reportDate = val
                break
            case "lastBunkerDate" :
                oldState.lastBunkerDate = val
                break
            case "lastBunkerQuantity" :
                oldState.lastBunkerQuantity = val
                break
            case "chiefEngineerName" :
                oldState.chiefEngineerName = val
                break
            case "bunkerROB" :
                oldState.bunkerROB = val
                break
            case "bunkerType" :
                switch (val) {
                    case "0" :
                        oldState.isMGO = true
                        oldState.isLO = false
                        oldState.isFW = false
                        break
                    case "1" :
                        oldState.isMGO = false
                        oldState.isLO = true
                        oldState.isFW = false
                        break
                    case "2" :
                        oldState.isMGO = false
                        oldState.isLO = false
                        oldState.isFW = true
                        break
                    default :
                        break
                }
                break
            default :
                break
        }
        this.setState(oldState)
    }

    handleRecordChange(event, dataFieldAffected = null, id = null, val =  null) {
        if (event !== undefined) {
            dataFieldAffected = event.target.dataset.datafield
            id = event.target.dataset.id
            val = event.target.value
        }
        let oldState = this.state;
        switch (dataFieldAffected) {    
            case "date" :
                oldState.records[id].date = new Date(val)
                break
            case "consumed" : 
                oldState.records[id].consumed = val
                break
            case "ROB" : 
                oldState.records[id].ROB = val
                break
            default :
                break
        }
        this.setState(oldState)
    }

    addRecord = () => {
        let oldState = this.state
        var initDate = new Date()
        oldState.records.push({
                date : initDate,
                consumed : 0,
                ROB : ''
            })
        this.setState(oldState) 
    }
    removeRecord = (event) => {
        let id = event.target.dataset.id;
        let oldState = this.state
        oldState.records.splice(id,1)
        this.setState(oldState) 
    }

    addDailyBunker = () => {
        if (this.sigCanvas === undefined || this.sigCanvas.isEmpty()) {
            alert("Please sign off")
        }
        var curState = this.state
        curState.signature = this.sigCanvas.getTrimmedCanvas().toDataURL('image/png')
        this.exporter.CreateDailyBunkerPDF(curState, (success) => {
            if (success) {
                this.backToDailyBunkerDash()
            }
        })
    }
    backToDailyBunkerDash = () => {
        this.props.history.push('/dailybunker/report')
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
                <Form.Row key={i} style={{marginTop : '20px', marginBottom : '20px', fontSize : '.8rem'}}>
                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Date</Form.Label>
                    </Col>
                    <Col xs={8} sm={5}>
                        <Form.Control type="date" min="1990"
                        data-id ={i}
                        data-datafield ="date"
                        className="recordInput"
                        onChange={this.handleRecordChange.bind(this)} value={JSDateToHTMLDateString(record.date)}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Consumed</Form.Label>
                    </Col>
                    <Col xs={8} sm={2} className="verticalCenter">
                        <Form.Control type="number"
                            className="recordInput"
                            data-id ={i}
                            data-datafield ="consumed"
                            onBlur={this.handleRecordBlur.bind(this)}
                            onFocus={this.handleRecordFocus.bind(this)}
                            onChange={this.decoratorHandleDataChange.bind(this)}
                            value={record.consumed}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>ROB</Form.Label>
                    </Col>
                    <Col xs={8} sm={4} className="verticalCenter">
                        <Form.Control type="text"
                            className="recordInput"
                            data-id ={i}    
                            data-datafield ="ROB"
                            onBlur={this.handleRecordBlur.bind(this)}
                            onFocus={this.handleRecordFocus.bind(this)}
                            onChange={this.decoratorHandleDataChange.bind(this)}
                            value={record.ROB}>
                        </Form.Control>
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
        var bunkerType = 0
        if (this.state.isMGO) {
            bunkerType = 0
        } else if (this.state.isLO) {
            bunkerType = 1
        } else if (this.state.isFW) {
            bunkerType = 2
        }
        var formDataTop = {
            fields : [{
                label : "Vessel",
                value : this.state.vessel,
                type : "select",
                datafield : "vessel",
                onChange : this.handleDataChange.bind(this),
                options : this.state.vesselNames
            },{
                label : "Chief Engineer Name",
                value : this.state.chiefEngineerName,
                type : "text",
                datafield : "chiefEngineerName",
                onChange : this.decoratorHandleDataChange.bind(this),
                onFocus : this.handleRecordFocus.bind(this),
                onBlur : this.handleRecordBlur.bind(this),
            },{
                label : "Report Date",
                value : this.state.reportDate,
                type : "date",
                datafield : "reportDate",
                onChange : this.handleDataChange.bind(this),
            },{
                label : "Last Bunker Date",
                value : this.state.lastBunkerDate,
                type : "date",
                datafield : "lastBunkerDate",
                onChange : this.handleDataChange.bind(this),
            },{
                label : "Last Bunker Quantity",
                value : this.state.lastBunkerQuantity,
                type : "number",
                datafield : "lastBunkerQuantity",
                onChange : this.decoratorHandleDataChange.bind(this),
                onFocus : this.handleRecordFocus.bind(this),
                onBlur : this.handleRecordBlur.bind(this),
            },{
                label : "Bunker ROB",
                value : this.state.bunkerROB,
                type : "text",
                datafield : "bunkerROB",
                onChange : this.decoratorHandleDataChange.bind(this),
                onFocus : this.handleRecordFocus.bind(this),
                onBlur : this.handleRecordBlur.bind(this),
            },{
                label : "Bunker Type",
                value : bunkerType,
                type : "select",
                datafield : "bunkerType",
                onChange : this.handleDataChange.bind(this),
                options : [{label : "MGO", value : 0},{label : "Lube Oil", value : 1},{label : "Fresh Water", value : 2}]
            }]
        }
        return (
        <Container>
            <Row>
                <Col style={{textAlign : 'center'}} >
                    <h1 className="formHeader1">Daily Bunker, Lubricants & Fresh Water Status Records</h1>
                </Col>
            </Row>
            <Row className="formContents">
                 <Col xs={12} sm={{span : 10, offset : 1}}>
                    {RenderForm(formDataTop)}
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
                            <Col xs={5} className="hide-on-xs">Date</Col>
                            <Col xs={2} className="hide-on-xs">Consumed</Col>
                            <Col xs={4} className="hide-on-xs">ROB</Col>
                            <Col xs={{span : 1, offset : 11}} sm={{span : 1, offset: 0}}> <Button variant='info' onClick={this.addRecord} style={{padding : '0 .4rem'}}>+</Button></Col>
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
                    <Button variant="secondary" onClick={this.backToDailyBunkerDash} style={{marginRight : '10px'}}>Back</Button>
                    <Button variant="primary" onClick={this.addDailyBunker}>Save</Button>
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
export default SpeechRecognition (options) (withRouter(DailyBunkerRecord));