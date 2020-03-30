import React from 'react';
import { Container, Row, Col, Button} from 'react-bootstrap'
import { withRouter } from "react-router-dom";

import PDFExporter from '../../../Helpers/PDFExporter/PDFExporter.js'
import APIService from "../../../Helpers/APIService.js"

import SignatureCanvas from 'react-signature-canvas'

import KOMlogo from "../../../images/komlogo.png"
import '../style.css'
class Congratulations extends React.Component { 
    exporter = new PDFExporter()
    sigCanvas = undefined
    api = new APIService()
    constructor(props, context) {
        super(props, context)
        var initDate = new Date()
        this.state={ 
            signature : undefined
        };
    }

    addDailyBunker = () => {
        if (this.sigCanvas === undefined || this.sigCanvas.isEmpty()) {
            alert("Please sign off")
        }
        var curState = this.state
        curState.signature = this.sigCanvas.getTrimmedCanvas().toDataURL('image/png')
        this.exporter.CreateCongratulationNote(curState, (success) => {
            if (success) {
                alert("Done")
            }
        })
    }
   
    render() { 
        return (
        <Container>
            <Row >
                <Col xs={6}>
                <img src={KOMlogo} style={{maxWidth : "100%"}}/>
                </Col>
            </Row>
            <Row style={{marginBottom : "30px", marginTop : "10vh"}}>
                <Col style={{textAlign : 'center'}} >
                    <h1 className="formHeader1">Welcome to Digispace</h1>
                </Col>
            </Row>
            <Row style={{marginBottom : "80px"}}>
                <Col style={{textAlign : 'center'}} >
                    <h2 className="formHeader1">Please Sign Off to Commence Opening</h2>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={{span : 10, offset : 1}} style={{textAlign : "center", marginTop : '30px'}}>
                <SignatureCanvas 
                    canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} 
                    ref={(ref) => { this.sigCanvas = ref }} />,
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={{span : 10, offset : 1}} style={{textAlign : "center", marginTop : '30px'}}>
                    <Button variant="primary" onClick={this.addDailyBunker}>Submit</Button>
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
export default (withRouter(Congratulations));