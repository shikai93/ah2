import React from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import { withRouter } from "react-router-dom";

import '../style.css'
class DailyBunkerRecord extends React.Component { 
    exporter = new PDFExporter()
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
            vesselNames : []
        };
    }
    componentDidMount() {
        this.getVessels()
    }
    handleDataChange(event) {
        let dataFieldAffected = event.target.dataset.datafield
        let oldState = this.state;
        let val = event.target.value;
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

    handleRecordChange(event) {
        let dataFieldAffected = event.target.dataset.datafield
        let id = event.target.dataset.id;
        let oldState = this.state;
        let val = event.target.value;
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

    JSDateToHTMLDateString = (JSDate) => {
        if (JSDate === undefined || !JSDate.getFullYear) {
            return ""
        }
        var datestring = JSDate.getFullYear()+'-'+ ("0"+(JSDate.getMonth()+1)).slice(-2) +'-'+ ("0" + JSDate.getDate()).slice(-2)
        return datestring
    }

    addDailyBunker = () => {
        this.exporter.CreateDailyBunkerPDF(this.state, (success) => {
            if (success) {
                this.backToDailyBunkerDash()
            }
        })
    }
    backToDailyBunkerDash = () => {
        this.props.history.push('/dailybunker/report')
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
                        <Form.Label>Date</Form.Label>
                    </Col>
                    <Col xs={8} sm={5}>
                        <Form.Control type="date" min="1990"
                        data-id ={i}
                        data-datafield ="date"
                        className="recordInput"
                        onChange={this.handleRecordChange.bind(this)} value={this.JSDateToHTMLDateString(record.date)}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>Consumed</Form.Label>
                    </Col>
                    <Col xs={8} sm={2} className="verticalCenter">
                        <Form.Control type="number" min="1990"
                        className="recordInput"
                        data-id ={i}
                        data-datafield ="consumed"
                        onChange={this.handleRecordChange.bind(this)} value={record.consumed}></Form.Control>
                    </Col>

                    <Col xs={4} sm={0} className="hide-on-sm extra-pad-on-xs">
                        <Form.Label>ROB</Form.Label>
                    </Col>
                    <Col xs={8} sm={4} className="verticalCenter">
                        <Form.Control type="text"
                        className="recordInput"
                        data-id ={i}    
                        data-datafield ="ROB"
                        onChange={this.handleRecordChange.bind(this)} value={record.ROB}></Form.Control>
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
        return (
        <Container>
            <Row>
                <Col style={{textAlign : 'center'}} >
                    <h1 className="formHeader1">Daily Bunker, Lubricants & Fresh Water Status Records</h1>
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
                        
                        <Form.Group controlId="formCEName">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Chief Engineer Name : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="text"
                                defaultValue={this.state.chiefEngineerName}
                                data-datafield ="chiefEngineerName"
                                onChange={this.handleDataChange.bind(this)}>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formReportedDate">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Report Date : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="date" min="1990"
                                data-datafield ="reportDate"
                                onChange={this.handleDataChange.bind(this)}  
                                defaultValue={this.JSDateToHTMLDateString(this.state.reportDate)}>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formLastBunkerDate">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Last Bunker Date : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="date" min="1990"
                                data-datafield ="lastBunkerDate"
                                onChange={this.handleDataChange.bind(this)} 
                                defaultValue={this.JSDateToHTMLDateString(this.state.lastBunkerDate)}></Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formLastBunkerQty">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Last Bunker Quantity : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="number"
                                data-datafield ="lastBunkerQuantity"
                                onChange={this.handleDataChange.bind(this)} 
                                defaultValue={this.state.lastBunkerQuantity}></Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formBunkerRob">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Bunker ROB : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control type="text"
                                data-datafield ="bunkerROB"
                                onChange={this.handleDataChange.bind(this)} 
                                defaultValue={this.state.bunkerROB}></Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formBunkerType">
                        <Form.Row>
                            <Col xs={4} md={2}>
                                <Form.Label>Bunker Type : </Form.Label>
                            </Col>
                            <Col xs={8} md={10}>
                                <Form.Control as="select"
                                defaultValue={bunkerType}
                                data-datafield ="bunkerType"
                                onChange={this.handleDataChange.bind(this)} >
                                    <option value={0}>MGO</option>
                                    <option value={1}>Lube Oil</option>
                                    <option value={2}>Fresh Water</option>
                                </Form.Control>
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
export default withRouter(DailyBunkerRecord);