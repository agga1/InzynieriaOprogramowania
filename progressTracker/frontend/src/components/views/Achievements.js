import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import { getTask } from '../functions/getData'
import Button from '../layout/Button';

export class Achievements extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
             this.setState(() => ({
                 loaded: true
             }))
        }
        else {
            alert('Log into to see the view');
            window.location.href = "/";
        }
    }

    prepareView() {
        if (this.state.loaded == false) {
            return (
                <Col xs={10} className="mb-5 mt-5">
                    <Spinner className="spinner"/>
                </Col>
            );
        } else {
            return (
                <Col xs={10} className="pr-4">
                    <Row className="pr-5 pl-5 ml-2 mb-4">
                    </Row>
                    <Row className="pr-5 pl-5 mb-4">
                        <Col xs={7}>

                        </Col>
                        <Col xs={5} className="mt-4 pr-5 text-right">
                            <Button path="/teacher/achievement/add" text="Add achievement" />
                        </Col>
                    </Row>
                </Col>
            );
        }
    }


    render() {
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/teacher/courses" button2_path="/" is_logout={true} />
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={2} />
                        <Col xs={10} className="task-heading title text-left">Achievements</Col>
                    </Row>
                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
                            <Sidebar />
                        </Col>
                        {this.prepareView()}
                    </Row>
                </Container>

                <Footer />
            </Fragment>
        )
    }
}

export default Achievements
