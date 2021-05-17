import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import TaskIcon from "../layout/icons/TaskIcon";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Spinner from "../layout/Spinner";
import Footer from "../layout/Footer";
import { getElement } from "../functions/helpers";
import Button from '../layout/Button';
import { Spinner as MiniSpinner } from "reactstrap";


export class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: localStorage.getItem("courseName"),
      tasks: [],
      grades: [],
      gradesLen: -1,
      loaded: false,
      isStudent: localStorage.getItem('isStudent'),
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getTasks();
      this.getGrades();
    } else {
      alert("Log in to see the view");
      window.location.href = "/";
    }
  }

  deleteParentTask() {
    if (localStorage.getItem('taskUrl')){
        localStorage.removeItem('taskUrl');
    }
}

  getTasks() {
    getElement(localStorage.getItem("courseUrl") + "main_tasks")
      .then((data) => {
        this.setState(() => {
          return {
            tasks: data.tasks,
            loaded: true,
          };
        });
      });
  }

  getGrades() {
    getElement("/api/grades/")
      .then((data) => {
        let grades = [];

        for (let i=0; i<data.length; i++) {
          if (data[i].course_name == this.state.name) {
            grades.push(data[i]);
          }
        }

        this.setState(() => {
          return {
            grades: grades,
            gradesLen: grades.length
          };
        });

      });
  }

  getGrade(taskName) {
    let i;
    for (i=0; i<this.state.grades.length; i++) {
      if (this.state.grades[i].task_name == taskName) {
        return this.state.grades[i].value.toString();
      }
    }
    if(i == this.state.gradesLen)
      return '-';

    return <MiniSpinner animation="border"/>;
  }


  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else if (this.state.tasks.length === 0){
      if (this.state.isStudent === 'true'){
        return (
          <Col xs={9} className="mb-5 mt-5">
              <h1 className="heading">There is no task in course {this.state.name}</h1>
          </Col> 
        );
      }
      else{
        return (
          <Row>
            <Col xs={9} className="mb-5 mt-5">
              <h1 className="heading">There is no task in course {this.state.name}</h1>
            </Col>
            <Col xs={3} className="mb-5 mt-5">
              <Button path="/teacher/task/add" onClick={this.deleteParentTask} className="w-80"  text="Add new task"/>
            </Col>
          </Row>   
        );
      }
      
    }
    else {
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
                  grade={this.getGrade(task.name)}
                  grades={this.state.grades}
                  gradesLen={this.state.gradesLen}
                />
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  render() {
    const coursesPath =  localStorage.getItem("isStudent") === "true" ? "/student/courses" : "/teacher/courses";
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
