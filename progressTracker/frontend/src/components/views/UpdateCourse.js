import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Spinner from "../layout/Spinner";
import { checkUser, getElement } from "../functions/helpers";
import AddCourseForm from '../layout/forms/AddCourseForm'

export class CourseUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      course: {},
      description: "",
      name: "",
      chosen_students: [],
      teacher: '',
      loaded: false,
    };

    this.handleName = this.handleName.bind(this);
    this.handleStudents = this.handleStudents.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNone = this.handleNone.bind(this);
  }

  componentDidMount() {
    checkUser("/student/courses").then((resp) => {
      if(resp != null){
        this.setState({ 
          teacher : resp.user.first_name + " " + resp.user.last_name,
        });
      }
    })

    getElement(localStorage.getItem('courseUrl'))
      .then((data) => {
        this.setState(() => ({
          course: data,
          description: data.description,
          name: data.name,
          loaded: true,
        }));
      })
      .catch((err) => alert(err.message));
  }

  handleDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  handleName = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handleStudents = (e) => {
    this.setState({chosen_students: e});
  }

  handleNone = (e) => { };

  handleSubmit = (e) => {
    e.preventDefault();
    fetch(localStorage.getItem("courseUrl"), {
      method: "PATCH",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.prepareData()),
    })
      .then(() => {
        window.location.href = "/teacher/course/details";
      })
      .catch((err) => console.log(err));
  };

  prepareData() {
    return {
      description: this.state.description,
      name: this.state.name,
      student: this.state.student,
    };
  }

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={10} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      const { description, name, chosen_students } = this.state;
      return(
        <Col xs={10} className="text-center">
          <AddCourseForm
            buttonText="Update course"
            handleName={this.handleName}
            handleDescription={this.handleDescription}
            handleSubmit={this.handleSubmit}
            handleStudents = {this.handleStudents}
            handlePassThreshold = {this.handleNone}
            teacher = {this.state.teacher}
            name = {name}
            description = {description}
            pass_threshold = {this.state.course.pass_threshold}
            chosen_students = {chosen_students} 
            readOnly={true}
          />
      </Col>);
    }}


  render() {
    return (
      <Fragment>
        <Header
          button1_text="My Tasks"
          button2_text="Log Out"
          button1_path="/teacher/course/tasks"
          button2_path="/"
          is_logout={true}
        />
        <Container fluid>
          <Row xs={3} className="mt-4 mb-5 ml-3">
            <Col xs={6} className="heading text-center login_heading">
              Update course
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={1}></Col>
            {this.prepareView()}
          </Row>
          <Row className="mb-5 mt-5" />
          </Container>
          <Footer/>
      </Fragment>
    );
  }
}

export default CourseUpdate;
