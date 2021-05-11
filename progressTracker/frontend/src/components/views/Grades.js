import React, { Component, Fragment } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Spinner from "../layout/Spinner";
import Modal from "../layout/RateStudentModal";
import { getStudents, getTask } from "../functions/helpers";

export class Grades extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: { name: " ", grade_max: 0 },
      students: [],
      grades: [],
      show: false,
      loaded: false,
      student_id: "",
      rate: "",
      title: "Rate student",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async getData() {
    let grades = await this.getStudentsGrades();
    let task = await getTask();
    let students = await getStudents();
    return { task: task, grades: grades, students: students };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getData()
        .then((data) => {
          this.setState(() => ({
            grades: data.grades,
            task: data.task,
            students: data.students,
            loaded: true,
          }));
        })
        .catch((err) => console.log(err.message));
    } else {
      alert("Log into to see the view");
      window.location.href = "/";
    }
  }

  getStudentsGrades() {
    if (sessionStorage.getItem("isStudent") == "false") {
      return fetch(localStorage.getItem("taskUrl") + "grades", {
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
          data = data.grades;
          return data;
        });
    } else {
      throw new Error("Only teacher can rate students!!!");
    }
  }

  showModal = (student) => {
    this.setState((state) => ({
      student_id: student.user.id,
      rate: "",
      show: !state.show,
      title: "Rate " + student.user.first_name + " " + student.user.last_name,
    }));
  };

  handleCancel = () => {
    this.setState((state) => ({
      student_id: "",
      rate: "",
      show: !state.show,
      title: "Rate student",
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var new_grade = parseFloat(this.state.rate.replace(",", "."));
    if (new_grade <= this.state.task.grade_max && new_grade >= this.state.task.grade_min) {
      fetch(localStorage.getItem("taskUrl") + "add_grade/", {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: [this.state.student_id],
          grades: [new_grade],
        }),
      })
        .then((res) => res.json())
        .then(() => {
          this.updateGradesList(new_grade);
        })
        .catch((err) => console.log(err));
    } else {
      alert(
        "Enter proper grade from range: [" + this.state.task.grade_min +
        ", " + this.state.task.grade_max + "]!"
      );
    }
  };

  updateGradesList(new_grade) {
    let item = this.state.grades
      .filter((grade) => grade.student == this.state.student_id)
      .map((grade) => grade);

    if (item[0] !== undefined) {
      this.setState(
        (state) => {
          let list = state.grades.map((val) => {
            if (val == item) {
              return { student: state.student_id, value: new_grade };
            } else {
              return val;
            }
          });
          console.log(list);
          return { grades: list };
        },
        () => this.handleCancel()
      );
    } else {
      this.setState(
        (state) => {
          return {
            grades: [
              ...state.grades,
              { student: state.student_id, value: new_grade },
            ],
          };
        },
        () => this.handleCancel()
      );
    }
  }

  handleChange = (e) => {
    this.setState({
      rate: e.target.value,
    });
  };

  getGrade(student) {
    for (var grade in this.state.grades) {
      if (this.state.grades[grade].student == student.user.id) {
        return this.state.grades[grade].value;
      }
    }
    return "-";
  }

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={10} className="mb-5 mt-5">
          <Spinner />
        </Col>
      );
    } else {
       if (localStorage.getItem("isParentTask") == "true") {
         return (
          <Col xs={10} className="pr-4">
            <Table striped className="students-list">
              <thead>
                <tr>
                  <th className="td-sm">no.</th>
                  <th colSpan="3">Name</th>
                  <th className="td-sm">Points</th>
                  <th className="td-sm">Prize</th>
                </tr>
              </thead>
              <tbody>
                {this.state.students.map((student) => {
                  return (
                    <tr key={student.user.id}>
                      <td className="td-sm" scope="row">
                        {this.state.students.indexOf(student)}
                      </td>
                      <td colSpan="3">
                        {student.user.first_name} {student.user.last_name}
                      </td>
                      <td className="td-sm">{this.getGrade(student)}</td>
                      <td className="td-sm">
                        <a
                          className="btn btn-sm"
                          role="button"
                          aria-pressed="true"
                        >
                          b
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        );
       } else {
         return (
          <Col xs={10} className="pr-4">
            <Table striped className="students-list">
              <thead>
                <tr>
                  <th className="td-sm">no.</th>
                  <th colSpan="3">Name</th>
                  <th className="td-sm">Points</th>
                  <th className="td-sm">Rate</th>
                  <th className="td-sm">Prize</th>
                </tr>
              </thead>
              <tbody>
                {this.state.students.map((student) => {
                  return (
                    <tr key={student.user.id}>
                      <td className="td-sm" scope="row">
                        {this.state.students.indexOf(student)}
                      </td>
                      <td colSpan="3">
                        {student.user.first_name} {student.user.last_name}
                      </td>
                      <td className="td-sm">{this.getGrade(student)}</td>
                      <td className="td-sm">
                        <a
                          className="btn"
                          role="button"
                          aria-pressed="false"
                          onClick={() => this.showModal(student)}
                        >
                          Rate
                        </a>
                      </td>
                      <td className="td-sm">
                        <a
                          className="btn btn-sm"
                          role="button"
                          aria-pressed="true"
                        >
                          b
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        );
       }

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
          is_logout={true}
        />
        <Container fluid>
          <Modal
            title={this.state.title}
            show={this.state.show}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
            handleChange={this.handleChange}
            rate={this.state.rate}
            max_grade={this.state.task.grade_max}
          />
          <Row className="mt-4 mb-5 ml-3">
            <Col xs={3} />
            <Col xs={6} className="heading login_heading text-left">
              {this.state.task.name}
            </Col>
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
    );
  }
}

export default Grades;
