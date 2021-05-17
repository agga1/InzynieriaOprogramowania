import React, { Component, Fragment } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Spinner from "../layout/Spinner";
import Modal from "../layout/RateStudentModal";
import { getStudents, getElement } from "../functions/helpers";
import CustomModal from "../layout/CustomModal";

export class Grades extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: { name: " ", grade_max: 0 },
      students: [],
      grades: [],
      show: false,
      showDelete: false,
      gradeToDelete: -1,
      loaded: false,
      student_id: "",
      rate: "",
      title: "Rate student",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
  }

  getData() {
    let grades = this.getStudentsGrades();
    let task = getElement(localStorage.getItem("taskUrl"));
    let students = getStudents();

    Promise.all([grades, task, students])
      .then(([grades, task, students]) => {
        this.setState(() => ({
          grades: grades,
          task: task,
          students: students,
          loaded: true,
        }));
      })
      .catch((err) => console.log(err.message));
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getData();
    } else {
      alert("Log into to see the view");
      window.location.href = "/";
    }
  }

  getStudentsGrades() {
    if (localStorage.getItem("isStudent") == "false") {
      return getElement(localStorage.getItem("taskUrl") + "grades").then(
        (data) => {
          data = data.grades;
          return data;
        }
      );
    } else {
      throw new Error("Only teacher can rate students!!!");
    }
  }

  showRateModal = (student) => {
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

  gradeExists(student_id) {
    let grade = this.state.grades
      .filter((grade) => grade.student == student_id)
      .map((p) => p);
    return grade.length > 0 ? grade[0] : undefined;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var new_grade = parseFloat(this.state.rate.replace(",", "."));

    if (
      new_grade <= this.state.task.grade_max &&
      new_grade >= this.state.task.grade_min
    ) {
      let grade = this.gradeExists(this.state.student_id);

      if (grade != undefined) {
        fetch("/api/grades/" + grade.id + "/", {
          method: "PATCH",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: new_grade,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            this.handleCancel();
            this.setState((state) => {
              let list = state.grades.map((val) => {
                if (val == grade) {
                  val.value = new_grade;
                }
                return val;
              });
              console.log(list);
              return {
                grades: list,
              };
            });
          })
          .catch((err) => console.log(err));
      } else {
        fetch("/api/grades/", {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.prepareData(new_grade)),
        })
          .then(() => {
            this.handleCancel();
            this.setState({ loaded: false }, () => {
              this.getStudentsGrades().then((grades) => {
                this.setState({ grades: grades, loaded: true });
              });
            });
          })
          .catch((err) => console.log(err));
      }
    } else {
      alert(
        "Enter proper grade from range: [" +
          this.state.task.grade_min +
          ", " +
          this.state.task.grade_max +
          "]!"
      );
    }
  };

  prepareData(new_grade) {
    return {
      task: this.state.task.id,
      value: new_grade,
      student: this.state.student_id,
      course: this.state.task.course,
      issued_by: Number(localStorage.getItem("userID")),
    };
  }

  handleChange = (e) => {
    this.setState({
      rate: e.target.value,
    });
  };

  showDeleteModal = (student) => {
    console.log(student)
    this.setState((state) => ({
      showDelete: !state.showDelete,
      gradeToDelete: this.gradeExists(student.user.id)
    }));
  };

  handleDeleteSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.gradeToDelete)
    fetch('/api/grades/'+this.state.gradeToDelete.id, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status < 300) {
          window.location.reload();
        } else {
          alert("Error occured. Error number: " + res.status);
        }
        this.handleDeleteCancel();
      })
      .catch((err) => console.log(err));
  };

  handleDeleteCancel = () => {
    console.log(this.state.gradeToDelete);
    this.setState((state) => ({
      showDelete: !state.showDelete,
      gradeToDelete: -1,
    }));
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
          <Spinner className="spinner" />
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
                {localStorage.getItem("isParentTask") == "true" ? (
                  <></>
                ) : (
                  <>
                    <th className="td-sm">Rate</th>
                    <th className="td-sm">Delete</th>
                  </>
                )}
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
                    {localStorage.getItem("isParentTask") == "true" ? (
                      <></>
                    ) : (
                      <>
                        <td className="td-sm">
                          <a
                            className="btn"
                            role="button"
                            aria-pressed="false"
                            onClick={() => this.showRateModal(student)}
                          >
                            Rate
                          </a>
                        </td>
                        <td className="td-sm">
                          <a
                            className="btn fas fa-trash fa-lg"
                            role="button"
                            aria-pressed="false"
                            onClick={() => this.showDeleteModal(student)}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
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
          <CustomModal 
          show={this.state.showDelete}
          title="Warning"
          body="Are you sure you want to delete this grade?"
          handleSubmit={this.handleDeleteSubmit}
          handleCancel={this.handleDeleteCancel}
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
