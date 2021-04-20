import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import CourseIcon from "../layout/CourseIcon";
import Spinner from "../layout/Spinner";
import Header from "../layout/Header";
import AddCourseCard from "../layout/AddCourseCard";
import Footer from "../layout/Footer";

export class StudentCourses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loaded: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      fetch("/api/courses", {
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
              data,
              loaded: true,
            };
          });
        });
    }
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
        <Col xs={12}>
          <Spinner />
        </Col>
      );
    } else {
      var comp;
      if (localStorage.getItem("isStudent") == "false") {
        comp = (
          <Col md={4} sm={6} xs={12} className="mb-4">
            <AddCourseCard path="/teacher/course/add" />
          </Col>
        );
      } else {
        comp = <div></div>;
      }
      return (
        <Fragment>
          {comp}
          {this.state.data.map((course) => {
            return (
              <Col md={4} sm={6} xs={12} className="mb-4" key={course.url}>
                <CourseIcon
                  course_name={course.name}
                  teacher_name={course.teacher_name}
                  course_url={course.url}
                  course_details_path="/student/course/tasks"
                />
              </Col>
            );
          })}
        </Fragment>
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
            <Col xs={6} className="heading login_heading">
              My courses
            </Col>
            <Col></Col>
          </Row>
          <Row className="m-2">{this.prepareView()}</Row>
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default StudentCourses;
