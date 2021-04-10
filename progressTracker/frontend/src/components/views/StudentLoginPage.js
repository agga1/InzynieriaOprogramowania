import React, { Component, Fragment} from 'react'
import { Container, Row, Col } from 'reactstrap';
import Header from '../layout/Header'
import LoginForm from '../layout/LoginForm'



export class StudentLoginPage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header button1_text="Student" button2_text="MainPage" button1_path="/student_login" button2_path="/"/>
                <Container fluid>
                    <Row className="mt-4 ml-3">
                        <Col xs={6} className="heading login_heading">Log into student's account</Col>     
                        <Col></Col>                                           
                    </Row>
                    <Row className="mt-4 ml-3">
                        <Col xs={6}><LoginForm/></Col>
                        <Col className="slogan"><img src="../../static/images/slogan1.png"  alt="slogan" /></Col>
                       
                     </Row>
                     <Row className="mt-4 ml-3">
                        <Col xs={6}></Col>
                        <Col className="log_image"><img src="../../static/images/breaking_rocks.png"  alt="sleeping students furing lecture" /></Col>
                     </Row>
                </Container>   
            </Fragment>
        )
    }
}

export default StudentLoginPage

