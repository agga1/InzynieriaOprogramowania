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
import {ProgressBar} from "react-bootstrap";
import toast from "react-hot-toast";
import { Container as FABContainer, Link as FABLink} from 'react-floating-action-button'


export class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: localStorage.getItem("courseName"),
      tasks: [],
      grades: [],
      points: -1,
      total: -1,
      gradesLen: -1,
      loaded: false,
      isStudent: localStorage.getItem('isStudent'),
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getData();
    } else {
      toast.error("Log in to see the view");
      window.location.href = "/";
    }
  }

  deleteParentTask() {
    if (localStorage.getItem('taskUrl')){
        localStorage.removeItem('taskUrl');
    }
}

  getTasks() {
    return getElement(localStorage.getItem("courseUrl") + "main_tasks")
      .then((data) => {
        let total = 0;
        data.tasks.map(task => total=total + task.grade_max)
        this.setState(() => {
          return {
            total: total,
          };
        });
        return data.tasks;
      });
  }


  getGrades() {
    return getElement("/api/grades/")
      .then((data) => {
        let grades = [];

        for (let i=0; i<data.length; i++) {
          if (data[i].course_name == this.state.name) {
            grades.push(data[i]);
          }
        }
        return grades;
      });
  }

  getPoints(tasks, grades){
    var points = 0;
    tasks.map(task => {
      grades.map( grade => {
        if(grade.task_name == task.name){
          points = points + grade.value;
        }
      })
    })
    return points;
  }

  getData() {
    let tasks = this.getTasks();
    let grades = this.getGrades();
    
    Promise.all([tasks, grades])
      .then(([tasks, grades]) => {
        this.setState(() => ({
          grades: grades,
          gradesLen: grades.length,
          tasks: tasks,
        }));
        let points = this.getPoints(tasks, grades);
        return points
      })
      .then((points) => {
        this.setState(() => ({
          points: points,
          loaded: true,
        }));
      })
      .catch((err) => console.log(err.message));
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

    return <MiniSpinner className="minispinner" animation="border"/>;
  }

  deleteLocalItems() {
    if (localStorage.getItem('taskUrl')){
      localStorage.removeItem('taskUrl');
    }
    if (localStorage.getItem("taskIsExtra")) {
      localStorage.removeItem("taskIsExtra");
    }
    if (localStorage.getItem("taskAggregation")) {
      localStorage.removeItem("taskAggregation");
    }
  }


  prepareButtons(){
    if (localStorage.getItem("isStudent") == "false"){
      return (
         <FABContainer>
          <FABLink
            tooltip="Add task"
            className="orange-bg plus-fa-size"
            icon="fas fa-plus fa-2x"
            href="/teacher/task/add"
            onClick={this.deleteLocalItems}
            />
       </FABContainer>
      )
    }
  }

  prepareProgressBarView(){
    const now = (this.state.points*100)/this.state.total;
    if(this.state.isStudent === "true" && this.state.loaded == true){
      return  (
          <Col md={4} sm={12} className="title text-left pt-md-5 pt-4">
            <ProgressBar animated variant="warning" now={now} label={`${Math.round(now)}%`} />
          </Col>)
    }
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
                  aggregation={task.aggregation_method}
                  isExtra={task.is_extra}
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
            <Col md={2} xs={0}></Col>
            <Col md={5} sm={12} className="title text-left">
              {this.state.name}
            </Col>
            
             {this.prepareProgressBarView()} 
          </Row>
          <Row>
            <Col md={2} sm={12} className="ml-md-0 pl-md-0 ">
              <Sidebar />
            </Col>
            <Col md={10} sm={12}>{this.prepareView()}</Col>
          </Row>
          {this.prepareButtons()}
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default Tasks;
