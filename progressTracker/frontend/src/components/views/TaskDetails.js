import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import { getTask } from '../functions/getData'
import Button from '../layout/Button';
import parse from "html-react-parser";

export class TaskDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            task: { name: '', grade_max: '' },
            loaded: false,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            getTask().then((data) => {
                this.setState(() => ({
                    task: data,
                    loaded: true
                }))
            })
                .catch((err) =>
                    alert(err.message)
                )
        }
        else {
            alert('Log into to see the view');
            window.location.href = "/";
        }
    }


    prepareView() {
        if (!this.state.loaded) {
            return (
                <Col xs={10} className="mb-5 mt-5">
                    <Spinner />
                </Col>
            );
        } else {
            return (
                <Col xs={10} className="pr-4">
                    <Row className="pr-5 mb-4" style={{ "paddingLeft": "60px" }}>
                        <h4 className="task-heading font-weight-bold">Description:</h4>
                    </Row>
                    <Row className="pr-5 pl-5 ml-2 mb-4">
                        <div>
                            {parse(this.state.task.description)}
                        </div>
                    </Row>
                    <Row className="pr-5 pl-5 mb-4">
                        <Col xs={7}>
                            <Row>
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold">Deadline</h4>
                                    <h5 style={{ "paddingLeft": "40px" }}>{this.state.task.deadline}</h5>
                                </Col>
                            </Row>
                            <Row >
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold" >Weight </h4>
                                    <h5 style={{ "paddingLeft": "58px" }}>{this.state.task.weight}</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold pr-4">Is extra </h4>
                                    <h5 style={{ "paddingLeft": "30px" }}>{this.state.task.is_extra ? "yes" : "no"}</h5>
                                </Col>
                            </Row>
                        </Col>
                        {sessionStorage.getItem('isStudent') == 'true' ? <Col></Col> :
                            <Col xs={5} className="mt-4 pr-5 text-right">
                                <Button path="/teacher/task/update" text="Edit description" />
                            </Col>
                        }
                    </Row>
                </Col>
            );
        }
    }


    render() {
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true} />
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={2} />
                        <Col xs={6} className="task-heading title text-left">{this.state.task.name}</Col>
                        <Col xs={3} className="task-heading login_heading text-right pr-5 pt-2" style={{ "fontSize": "40px" }}>{this.state.task.grade_max}</Col>
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

export default TaskDetails
