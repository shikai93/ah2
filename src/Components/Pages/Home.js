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
                            <Col xs={6} sm={4}>
                                <Button variant="primary" onClick={this.toMaintenanceReports}>Machinery Maintenance</Button>
                            </Col>
                            <Col xs={6} sm={4}>
                                <Button variant="primary" onClick={this.toWeeklyDefects}>Weekly Defect</Button>
                            </Col>
                            <Col xs={6} sm={4}>
                                <Button variant="primary" onClick={this.toDailyBunker}>Daily Bunker, Lubricants & Fresh Water</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(Home);