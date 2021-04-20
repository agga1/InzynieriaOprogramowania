import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import TaskIcon from "../layout/TaskIcon";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Spinner from "../layout/Spinner";
import Footer from "../layout/Footer";

export class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: localStorage.getItem("courseName"),
      tasks: [],
      loaded: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getTasks();
    } else {
      alert("Log in to see the view");
      window.location.href = "/";
    }
  }

  getTasks() {
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
            tasks: data.tasks,
            loaded: true,
          };
        });
      });
  }

  handleLogout = () => {
    fetch("/api/auth/logout", {
      crossDomain: true,
      withCredentials: true,
      async: true,
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).catch((error) => {
      console.log(error);
    });
    localStorage.removeItem("token");
  };

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Spinner />
        </Col>
      );
    } else {
      return (
        <Row className="p-2">
          {this.state.tasks.map((task) => {
            return (
              <Col
                xs={12}
                key={task.name + task.deadline + task.url}
              >
                <TaskIcon
                  task_name={task.name}
                  deadline={task.deadline}
                  url={task.url}
                  max_points={task.grade_max}
                />
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <Header
          button1_text="My Courses"
          button2_text="Log Out"
          button1_path="/student/courses"
          button2_path="/"
          button2_handle={this.handleLogout}
        />
        <Container fluid>
          <Row className="mt-4 mb-5 ml-3">
            <Col xs={2}></Col>
            <Col xs={6} className="title text-left">
              {this.state.name}
            </Col>
          </Row>
          <Row>
            <Col xs={2} className="ml-0 pl-0">
              <Sidebar />
            </Col>
            <Col xs={10}>{this.prepareView()}</Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default Tasks;
