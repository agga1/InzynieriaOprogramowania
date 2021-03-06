import React, { Component, Fragment } from 'react'
import { Container, Row, Col} from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import {getElement, getStudents} from '../functions/helpers'
import { MDBDataTable } from 'mdbreact';
import {ProgressBar} from "react-bootstrap";
import toast from 'react-hot-toast';


export class Leaderboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: localStorage.getItem('courseName'),
      students: [],
      tasks: [],
      tasks_len: -1,
      grades: new Map(),
      max: 0,
      loaded: false,
      grades_loaded: false,
    }
	}

  getData() {
    let tasks = this.getTasksAndGrades();
    let students = getStudents();
    Promise.all([tasks, students])
      .then(([tasks, students]) => {
        this.setState(() => ({
          students: students,
          tasks: tasks,
          tasks_len: Object.keys(tasks).length,
          loaded: true,
          grades_loaded: Object.keys(tasks).length > 0 ? false : true,
        }));
      })
      .catch((err) => console.log(err.message));
    }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getData();
    } else {
      toast.error("Log into to see the view", {duration:6000});
      window.location.href = "/";
    }
  }

  getTasksAndGrades() { 
    return getElement(localStorage.getItem("courseUrl") + "main_tasks")
      .then((data1) => {
        let tasks = data1.tasks;
        let counter = 0;
        let grades_list = this.state.grades;
        tasks.map( task => {
        return getElement(task.url + "grades/")
          .then((data2) => {
            counter++;
            data2.grades.map((grade) =>{
              if(!grades_list.has(task.url + "_" + grade.student)){
                grades_list.set(task.url +"_" + grade.student, grade.value);
              }
            })
            this.setState(() => ({
              grades: grades_list,
              grades_loaded: counter == this.state.tasks_len,
              max: this.state.max + task.grade_max,
              }
            ))
          })
        })
      return tasks;
      })
  }

  getAllGrades(student_id) {
    let list = [];
    let points = 0;
    this.state.tasks.map(task => {
      var key = task.url + "_" + student_id
      if (this.state.grades.has(key)){
        var value = this.state.grades.get(key);
        points+=parseInt(value);
        list.push({"key": key, "value": value});
      }
      else
        list.push({"key": key, "value": "0"});
    });
    return { grades: list, points: points};
  }

  prepareData(){
    const data = {
      columns: [],
      rows: [],
    }
    data.columns.push({
      label: 'Name',
      field: 'name',
      sort: 'asc',
    },)
    data.columns.push({
      label: 'Progress',
      field: 'progress',
      sort: 'asc',
    },)
    this.state.tasks.map( (task) => {
      data.columns.push({
        label: task.name,
        field: task.url,
        sort: 'asc',
      })
    })
    data.columns.push({
      label: 'Total',
      field: 'total',
      sort: 'desc',
    })
    this.state.students.map((student) => {
      var result = this.getAllGrades(student.user.id);
      var obj = {name: student.user.first_name + " " + student.user.last_name}
      result.grades.map((res) => {
        var label = res["key"].split('_')[0];
        var val = res["value"];
        obj[[label]]=val;
      })
      obj["total"]= result.points;
      obj["progress"] = <ProgressBar animated variant="warning" now={`${(result.points*100)/this.state.max}`} />
      data.rows.push(obj)
    })

    return data;
  }

  prepareView() {
    if (this.state.loaded === false || this.state.grades_loaded === false) {
      return (
        <Col md={10} className="mb-3 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      return (
        <Col md={10} className="pr-4">
          <MDBDataTable
            striped
            bordered
            small
            order={['total', 'desc' ]}
            data={this.prepareData()}
          />
       </Col>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true}/>
        <Container fluid>
          <Row className="mt-4 mb-3 ml-3">
            <Col md={2}></Col>
            <Col md={9} className="heading title text-left">{this.state.name}</Col>
            <Col md={12} className="heading subtitle text-center">Leaderboard</Col>
          </Row>
          <Row>
            <Col md={2} className="ml-md-0 pl-md-0">
              <Sidebar/>
            </Col>
              {this.prepareView()}
          </Row>
        </Container>
        <Footer/>
      </Fragment>
    )
  }
}

export default Leaderboard