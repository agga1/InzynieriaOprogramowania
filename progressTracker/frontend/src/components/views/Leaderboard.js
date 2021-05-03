import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Table } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import LeaderboardRow from '../layout/LeaderboardRow';
import {getStudents} from '../functions/getData'

export class Leaderboard extends Component {
    constructor(props) {
		super(props)

        this.state = {
             name: localStorage.getItem('courseName'),
			       students: [],
             tasks: [],
             tasks_len: -1,
             grades: new Map(),
             loaded: false,
             grades_loaded: false,
		}
	}

  async getData() {
    let promise1 = new Promise((resolve, reject) => {
      resolve(getStudents());
    })
    let promise2 = new Promise((resolve, reject) => {
      resolve(this.getTasksAndGrades());
    })
    let students = await promise1;
    let tasks = await promise2;
    return { students: students, tasks: tasks};
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getData()
        .then((data) => {
          this.setState(() => ({
            students: data.students,
            tasks: data.tasks,
            tasks_len: Object.keys(data.tasks).length,
            loaded: true,
            grades_loaded: false,
          }));
        })
        .catch((err) => alert(err.message));
    } else {
      alert("Log into to see the view");
      window.location.href = "/";
    }
  }

  getTasksAndGrades() { 
    return fetch(localStorage.getItem("courseUrl") + "main_tasks", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
    .then((response1) => {
      if (response1.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
      return response1.json();
    })
    .then((data1) => {
      let tasks = data1.tasks;
      let counter = 0;
      let grades_list = this.state.grades;
      tasks.map( task => {
      return fetch(task.url + "grades/", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response2) => {
        if (response2.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response2.json();
      })
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
            }
          ))
          console.log(this.state.grades_loaded);
        }) 
        
    })
    return tasks;
  })
}

    getAllGrades(student_id){
      let list = [];
      let points = 0;
      this.state.tasks.map(task => {
        var key = task.url + "_" + student_id
        if (this.state.grades.has(key)){
          var value = this.state.grades.get(key);
          points+=parseInt(value);
          list.push(value);
        } 
        else
          list.push("-");
      });
      return { grades: list, points: points};
    }

    prepareView() {
      if (this.state.loaded == false || this.state.grades_loaded == false) {
        return (
          <Col xs={10} className="mb-5 mt-5">
            <Spinner />
          </Col>
        );
      } else {
        return (
          <Col xs={10}>
          <Table striped className="students-list">
          <thead>
              <tr>
              <th></th>
              <th>Name</th>
              {this.state.tasks.map(task => {
                  return <th>{task.name}</th>
              })}
              <th>Total</th>
              </tr>
          </thead>
          <tbody>
              {this.state.students.map(student=> {
                var result = this.getAllGrades(student.user.id);
                  return (
                      <LeaderboardRow
                          key = {this.state.students.indexOf(student)}
                          id = {this.state.students.indexOf(student)}
                          name = {student.user.first_name + " " + student.user.last_name}
                          grades = {result.grades}
                          total = {result.points}
                      />
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
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Row className="mt-4 mb-3 ml-3">
                        <Col xs={2}></Col>  
                        <Col xs={6} className="heading title text-left">{this.state.name}</Col>    
                        <Col xs={12} className="heading subtitle text-center">Leaderboard</Col>              
                    </Row>
                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
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