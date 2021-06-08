import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import GroupIcon from "../layout/icons/GroupIcon";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Spinner from "../layout/Spinner";
import Footer from "../layout/Footer";
import {checkUser, deleteElement, getElement, getStudents} from "../functions/helpers";
import Button from '../layout/Button';
import RateGroupModal from "../layout/RateGroupModal";
import CustomModal from "../layout/modals/CustomModal";

export class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: localStorage.getItem("courseName"),
      groups: [],
      loaded: false,
      groupStudents: new Set(),
      groupID: -1,
      showRate: false,
      tasks: [],
      task: {grade_max: 0},
      selectedTask: null,
      showDelete: false,
      title: "Rate group"
    };

    this.showRateModal = this.showRateModal.bind(this);
    this.handleSelectTask = this.handleSelectTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleHideDeleteModal = this.handleHideDeleteModal.bind(this);
  }

  componentDidMount() {
    checkUser("/student/courses");
    this.getGroups();
    this.getTasks();
  }

  setGroup(students, group) {
    let groupStudents = [];
    let groupStudentsIDs = new Set();

    for (let student of group.student) {
      groupStudents.push(students.get(student));
      groupStudentsIDs.add(student);
    }

    return {
      id: group.id,
      name: group.name,
      students: groupStudents,
      studentsIDs: groupStudentsIDs
    };
  }

  getGroups() {
    getStudents()
      .then(data => {
        let students = new Map();
        for (let student of data) {
          students.set(student.user.id, student.user.last_name);
        }

        getElement(localStorage.getItem("courseUrl") + "groups")
        .then((data) => {
          let groups = [];
          for (let group of data.groups) {
            groups.push(this.setGroup(students, group));
          }

          this.setState(() => {
            return {
              loaded: true,
              groups: groups,
            };
          });
        });
      });
  }

  getTasks() {
    getElement(localStorage.getItem("courseUrl") + "tasks")
      .then((data) => {
        this.setState(() => {
          return {
            tasks: data.tasks
          };
        });
      });
  }

  showRateModal = (name, id, students) => {
    this.setState((state) => ({
      groupID: id,
      groupStudents: students,
      rate: "",
      showRate: !state.showRate,
      title: `Rate group "${name}"`,
    }));
  }

  handleSelectTask = event => {
    getElement("/api/tasks/" + event.value)
      .then((task) => {
        this.setState({
          task: task,
          selectedTask: event
        })
      })
  }

  handleChange = (e) => {
    this.setState({
      rate: e.target.value,
    });
  };

  gradeExists(students, grades) {
    let grade =
      grades
      .filter((grade) => students.has(grade.student))
      .map((p) => p);
    return grade.length > 0 ? grade[0] : undefined;
  }

  prepareData(grade, task) {
    return {
      grade: grade,
      task: task,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const new_grade = parseFloat(this.state.rate.replace(",", "."));

    if (
      new_grade <= this.state.task.grade_max &&
      new_grade >= this.state.task.grade_min
    ) {
      getElement("/api/tasks/" + this.state.selectedTask.value + "/children")
        .then((data) => {
          if (data.children.length === 0) {
            getElement("/api/tasks/" + this.state.selectedTask.value + "/grades")
              .then((data) => {
                let grade = this.gradeExists(this.state.groupStudents, data.grades);

                if (grade != undefined) {
                 alert("At least one of the students have already been given a grade");
                } else {
                  fetch("/api/groups/" + this.state.groupID + "/add_grade/", {
                    method: "POST",
                    headers: {
                      Authorization: `Token ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.prepareData(new_grade, this.state.selectedTask.value)),
                  })
                    .then(() => {
                      this.handleCancel();
                    })
                    .catch((err) => console.log(err));
                }
              })
          } else {
            alert("You can give a grade only to a task that does not have any subtasks");
          }
        })
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

  handleCancel = () => {
    this.setState((state) => ({
      groupID: -1,
      rate: "",
      showRate: !state.showRate,
      title: "Rate group",
    }));
  };

  showDeleteModal = (id) => {
    this.setState((state) => ({
      groupID: id,
      showDelete: !state.showDelete,
    }));
  };

  handleDeleteSubmit = (e) => {
    e.preventDefault();
    deleteElement('/api/groups/' + this.state.groupID)
      .then(() => {
        this.handleHideDeleteModal();
        window.location.reload();
      });
  };

  handleHideDeleteModal = () => {
    this.setState((state) => ({
      groupID: -1,
      showDelete: !state.showDelete,
    }));
  };

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else if (this.state.groups.length === 0){
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Row className="p-2">
            <h1 className="heading">There is no group in course {this.state.name}</h1>
          </Row>
          <Row className="pr-5 pl-5 mb-4">
            <Col xs={7}></Col>
            <Col xs={5} className="mt-4 pr-5 text-right">
              <Button path="/teacher/group/add" text="Add group"/>
            </Col>
          </Row>
        </Col>
      );
    } else {
      return (
        <Col>
          <Row className="p-2">
            {this.state.groups.map((group) => {
              return (
                <Col xs={12} key={group.id}>
                  <GroupIcon
                    id={group.id}
                    name={group.name}
                    students={group.students}
                    studentsIDs={group.studentsIDs}
                    showRate={this.showRateModal}
                    showDelete={this.showDeleteModal}
                  />
                </Col>
              );
            })}
          </Row>
          <Row className="pr-5 pl-5 mb-4">
            <Col xs={7}></Col>
            <Col xs={5} className="mt-4 pr-5 text-right">
              <Button path="/teacher/group/add" text="Add group"/>
            </Col>
          </Row>
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
          button1_path="/teacher/courses"
          button2_path="/"
          is_logout={true}
        />
        <Container fluid>
          <RateGroupModal
            title={this.state.title}
            show={this.state.showRate}
            tasks={this.state.tasks}
            handleSelect={this.handleSelectTask}
            handleRateChange={this.handleChange}
            task={this.state.task}
            selectedTask={this.state.selectedTask}
            rate={this.state.rate}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
          />
          <CustomModal
            show={this.state.showDelete}
            title="Warning"
            body="Are you sure you want to delete this group?"
            handleSubmit={this.handleDeleteSubmit}
            handleCancel={this.handleHideDeleteModal}
          />
          <Row className="mt-4 mb-5 ml-3">
            <Col md={2}></Col>
            <Col md={9} className="title text-left">
              {this.state.name}
            </Col>
          </Row>
          <Row>
            <Col md={2} className="ml-md-0 pl-md-0">
              <Sidebar />
            </Col>
            <Col md={10}>{this.prepareView()}</Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default Groups;
