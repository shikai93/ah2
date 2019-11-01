import React from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button} from 'react-bootstrap'

class Home extends React.Component { 
    toMaintenanceReports = () => {
        this.props.history.push("/maintenance/report");
    }
    toWeeklyDefects = () => {
        this.props.history.push("/weeklydefect/report");
    }
    toDailyBunker = () => {
        this.props.history.push("/dailybunker/report");
    }
    toAttendance = () => {
        this.props.history.push("/attendance");
    }
    render() {
        return (
            <Container>
                <Row style={{marginBottom : '30px'}}>
                    <Col style={{textAlign : 'center'}}>
                        <h1>Welcome to AssetCare 2.0</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={{span : 10, offset : 1}}>
                        <Row>
                            <Col xs={6} sm={4} style={{marginTop : "10px"}}>
                                <Button variant="primary" onClick={this.toMaintenanceReports} style={{width:"100%", height : "100%"}}>Machinery Maintenance</Button>
                            </Col>
                            <Col xs={6} sm={4} style={{marginTop : "10px"}}>
                                <Button variant="primary" onClick={this.toWeeklyDefects} style={{width:"100%", height : "100%"}}>Weekly Defect</Button>
                            </Col>
                            <Col xs={6} sm={4} style={{marginTop : "10px"}}>
                                <Button variant="primary" onClick={this.toDailyBunker} style={{width:"100%", height : "100%"}}>Daily Bunker, Lubricants & Fresh Water</Button>
                            </Col>
                            <Col xs={6} sm={4} style={{marginTop : "10px"}}>
                                <Button variant="primary" onClick={this.toAttendance} style={{width:"100%", height : "100%"}}>Attendance App</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(Home);