import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import AddTaskForm from "../layout/forms/AddTaskForm";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Spinner from "../layout/Spinner";
import { getElement } from "../functions/helpers";
import toast from "react-hot-toast";

export class AddTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: {},
      description: "",
      deadline: "",
      loaded: false,
    };
    this.handleDescription = this.handleDescription.bind(this);
    this.handleDeadline = this.handleDeadline.bind(this);
    this.handleNone = this.handleNone.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      fetch("/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.user.is_student != false) {
            toast.error("Only teacher can add tasks");
            window.location.href = "/student/courses";
          }
        })
        .catch((err) => console.log(err));

      getElement(localStorage.getItem('taskUrl'))
        .then((data) => {
          this.setState(() => ({
            task: data,
            description: data.description,
            deadline: data.deadline,
            loaded: true,
          }));
        })
        .catch((err) => console.log(err.message));
    } else {
      toast.error("Log into to see the view");
      window.location.href = "/";
    }
  }

  handleDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  handleDeadline = (event) => {
    this.setState({
      deadline: event.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    fetch(localStorage.getItem("taskUrl"), {
      method: "PATCH",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.prepareData()),
    })
      .then(() => {
        window.location.href = "/teacher/task/details";
      })
      .catch((err) => console.log(err));
  };

  handleNone = (e) => { };

  prepareData() {
    return {
      description: this.state.description,
      deadline: this.state.deadline
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
      const { description, deadline } = this.state;
      return(
        <Col xs={10} className="text-center">
          <AddTaskForm
            buttonText="Update"
            handleName={this.handleNone}
            handleDescription={this.handleDescription}
            handleGradeMin={this.handleNone}
            handleGradeMax={this.handleNone}
            handleWeight={this.handleNone}
            handleDeadline={this.handleDeadline}
            handleExtra = {this.handleNone}
            handleAggregation = {this.handleNone}
            handleSubmit={this.handleSubmit}
            name={this.state.task.name}
            description={description}
            gradeMin={this.state.task.gradeMin}
            gradeMax={this.state.task.gradeMax}
            weight={this.state.task.weight}
            deadline={deadline}
            readOnly={true}
            isExtra = {this.state.task.is_extra}
            aggregation = {{label:this.state.task.aggregation_method}}
            aggregationOptions = {[]}
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
              Update task
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

export default AddTask;
