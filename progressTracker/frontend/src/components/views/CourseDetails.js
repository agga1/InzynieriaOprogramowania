import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import Button from '../layout/Button';

export class CourseDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: localStorage.getItem("courseName"),
            description: '',
            pass_threshold: '',
            teacher: { title: '', user: {}},
            students_number: 0,
            tasks_number: 0,
            loaded: false,
        }
    }

    getCourseDetails() {
        fetch(localStorage.getItem("courseUrl"), {
            method: "GET",
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then((data) => {
                this.setState(() => {
                    return {
                        description: data.description,
                        pass_threshold: data.pass_threshold,
                        teacher: data.teacher,
                        loaded: true,
                    };
                });
            });
    }

    getStudentsNumber(){
        fetch(localStorage.getItem("courseUrl") + "students", {
            method: "GET",
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then((data) => {
                this.setState(() => {
                    return {
                       students_number: data.students.length,
                    };
                });
            });
    }

    getMainTasksNumber(){
        fetch(localStorage.getItem("courseUrl") + "main_tasks", {
            method: "GET",
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then((data) => {
                this.setState(() => {
                    return {
                        tasks_number: data.tasks.length,
                    };
                });
            });
    }

    presentTeacher(){
        return this.state.teacher.title + " " + this.state.teacher.user.first_name + " " + this.state.teacher.user.last_name;
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.getCourseDetails();
            this.getStudentsNumber();
            this.getMainTasksNumber();
        }
        else {
            alert('Log into to see the view');
            window.location.href = "/";
        }
    }


    prepareView() {
        if (this.state.loaded === false) {
            return (
                <Col xs={10} className="mb-5 mt-5">
                    <Spinner />
                </Col>
            );
        } else {
            return (
                <Col xs={10} className="pr-4">
                    <Row className="pr-5 pl-5 mb-4">
                        <Col xs={7}>
                            <Row className="ml-1 mb-3">
                                <h4 className="task-heading font-weight-bold">Description:</h4>
                            </Row>
                            <Row  className="ml-1 mb-3">
                                <h5>{this.state.description}</h5>
                            </Row>
                            <Row className="ml-1 mb-3">
                                <h4 className="task-heading font-weight-bold">Teacher:</h4>
                            </Row>
                            <Row  className="ml-1">
                                <h5>{this.presentTeacher()}</h5>
                            </Row>
                            <Row  className="ml-1 mb-3">
                                <h6>{this.state.teacher.user.email}</h6>
                            </Row>
                            <Row className="mb-3">
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold">Pass Threshold:</h4>
                                    <h5 style={{ "paddingLeft": "40px" }}>{this.state.pass_threshold}</h5>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold">Students Number:</h4>
                                    <h5 style={{ "paddingLeft": "40px" }}>{this.state.students_number}</h5>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold">Tasks Number:</h4>
                                    <h5 style={{ "paddingLeft": "40px" }}>{this.state.tasks_number}</h5>
                                </Col>
                            </Row>
                        </Col>
                        {sessionStorage.getItem('isStudent') === 'true' ? <Col></Col> :
                            <Col xs={5} className="pr-5 text-right">
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
                        <Col xs={6} className="task-heading title text-left">{this.state.name}</Col>
                        <Col xs={4} />
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

export default CourseDetails
