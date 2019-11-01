import React from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Form} from 'react-bootstrap'
import AttendanceAPI from "../../Helpers/Attendance/AttendanceAPI.js"
import Messages from '../../Helpers/messages/MessageRenderer.js'
import QrReader from 'react-qr-reader'
import { JSDateToHTMLDateString } from "../../Helpers/Helper.js"
class Attendance extends React.Component { 
    constructor(props, context) {
        super(props, context)
        var initDate = new Date()
        this.state={ 
            attendanceDate : initDate,
            meeting : '',
            attendees : [],
            messages : [],
            qrON : false
        };
        this.attendanceAPI = new AttendanceAPI()
    }
    toHome = () => {
        this.props.history.push("/");
    }
    saveAttendance = () => {
        if (this.state.meeting === '') {
            alert ("Please enter meeting name")
            return
        }
        if (this.state.attendees.length === 0) {
            alert("Please enter at least 1 attendee")
            return
        }
        this.attendanceAPI.LogAttendance(this.state.attendanceDate, this.state.attendees, this.state.meeting, (success) => {
            if (success) {
                this.toHome()
            } else {
                var newState = this.state
                newState.messages = ["Error saving attendance"]
                this.setState(newState)
            }
        })
    }
    
    handleDataChange(event, dataFieldAffected = null, val = null) {
        if (event !== undefined) {
            dataFieldAffected = event.target.dataset.datafield
            val = event.target.value
        }
        let oldState = this.state;
        switch (dataFieldAffected) {    
            case "attendanceDate" :
                oldState.attendanceDate = val
                break
            case "meeting" :
                oldState.meeting = val
                break
            default :
                break
        }
        this.setState(oldState)
    }

    // MARK : QR reader
    handleScan = data => {
        if (data) {
            let oldState = this.state;
            oldState.attendees.push(data);
            oldState.qrON = false;
            this.setState(oldState)
        }
    }
    handleError = err => {
        console.error(err)
    }
    renderReader = () => {
        if (this.state.qrON) {
            return (
                <QrReader
                    delay={500}
                    style={{ width: '100%' }}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    />)
        } else {
            return
        }
    }

    // MARK : Handle Attendees
    addAttendee = () => {
        var oldState = this.state
        oldState.qrON = true
        this.setState(oldState)
    }
    removeAttendee = (event) =>{
        var oldState = this.state
        let id = event.target.dataset.id;
        oldState.attendees.splice(id,1)
        this.setState(oldState)
    }
    renderAttendees = () => {
        var attendeeElms = []
        for (var i=0; i < this.state.attendees.length; i++) {
            var attendee = this.state.attendees[i]
            attendeeElms.push(
                <Row key={i}>
                    <Col xs={6} style ={{display: "flex", alignItems: "center"}}>
                        <div>{attendee}</div>
                    </Col>
                    <Col xs={6}>
                        <Button variant="danger" data-id={i} onClick={this.removeAttendee} style={{borderRadius : "50%"}}>-</Button>
                    </Col>
                </Row>
            )
        }
        return attendeeElms
    }
    
    render() {
        return (
            <Container>
                <Messages messages={this.state.messages}></Messages>
                <Row style={{marginBottom : '30px'}}>
                    <Col style={{textAlign : 'center'}}>
                        <h1>Take Attendance</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={{span : 10, offset : 1}}>
                        <Form>
                            <Form.Group controlId="formDate" >
                            <Form.Row>
                                <Col xs={4} xl={2}>
                                    <Form.Label>Attendace Date : </Form.Label>
                                </Col>
                                <Col xs={8} xl={10}>
                                    <Form.Control type="date" min="1990"
                                     data-datafield ="attendanceDate"
                                     onChange={this.handleDataChange.bind(this)}  
                                     defaultValue={JSDateToHTMLDateString(this.state.attendanceDate)}>
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            </Form.Group>
                            <Form.Group controlId="formMeeting" >
                            <Form.Row>
                                <Col xs={4} xl={2}>
                                    <Form.Label>Meeting : </Form.Label>
                                </Col>
                                <Col xs={8} xl={10}>
                                    <Form.Control type="text"
                                     data-datafield ="meeting"
                                     onChange={this.handleDataChange.bind(this)}  
                                     defaultValue={this.state.meeting}>
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            </Form.Group>
                        </Form>
                        <Row className="align-items-center" style={{paddingTop : "10px", paddingBottom : "20px"}}>
                            <Col xs={{span : 8, offset : 2}}>
                                {this.renderAttendees()}
                            </Col>
                        </Row>
                        <Row className="align-items-center">
                            <Col xs={10}>
                                {this.renderReader()}
                            </Col>
                            <Col xs={2} style={{textAlign : "right", alignItems : "center"}}>
                                <Button variant="info" onClick={this.addAttendee}>+</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginTop : "20px"}}>
                    <Col xs={12} sm={{span : 10, offset : 1}} style={{textAlign : "right"}}>
                        <Button variant="secondary" onClick={this.toHome} style={{margin : "0 10px"}}>Home</Button>
                        <Button variant="primary" onClick={this.saveAttendance}>Save</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(Attendance);