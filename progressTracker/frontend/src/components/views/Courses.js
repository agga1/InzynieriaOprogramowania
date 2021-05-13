import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import CourseIcon from "../layout/icons/CourseIcon";
import Spinner from "../layout/Spinner";
import Header from "../layout/Header";
import AddCourseIcon from "../layout/icons/AddCourseIcon";
import Footer from "../layout/Footer";
import { getElement } from "../functions/helpers";

export class Courses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loaded: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.setID();
      getElement("/api/courses")
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

  setID() {
    getElement('/api/auth/user')
      .then(resp => {
          localStorage.setItem("userID", resp.user.id);
      })
      .catch(err => console.log(err));
    }

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={12}>
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      var comp;
      if (localStorage.getItem('isStudent') == "false") {
        comp = (
          <Col md={4} sm={6} xs={12} className="mb-4">
            <AddCourseIcon path="/teacher/course/add" />
          </Col>
        );
      } else {
        comp = <div></div>;
      }
      return (
        <Fragment>
          {comp}
          {this.state.data.map((course) => {
            const tasksPath =  localStorage.getItem("isStudent") == "true" ? "/student/course/tasks" : "/teacher/course/tasks"
            return (
              <Col md={4} sm={6} xs={12} className="mb-4" key={course.url}>
                <CourseIcon
                  course_name={course.name}
                  description={course.description}
                  teacher_name={course.teacher_name}
                  course_url={course.url}
                  course_details_path={tasksPath}
                />
              </Col>
            );
          })}
        </Fragment>
      );
    }
  }

  render() {
    const coursesPath =  localStorage.getItem("isStudent") === "true" ? "/student/courses" : "/teacher/courses"
    return (
      <Fragment>
        <Header
          button1_text="My Courses"
          button2_text="Log Out"
          button1_path={coursesPath}
          button2_path="/"
          is_logout={true}
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

export default Courses;
