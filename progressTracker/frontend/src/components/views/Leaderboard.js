import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Table } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import LeaderboardRow from '../layout/LeaderboardRow';
import {getStudents, getTask} from '../functions/getData'
import { array } from 'prop-types';

export class Leaderboard extends Component {
    constructor(props) {
		super(props)

        this.state = {
             name: localStorage.getItem('courseName'),
			       students: [],
             tasks: [],
             grades: [],
             loaded: false,
             tasks_loaded: false,
		}
	}

    componentDidMount() {
        if (localStorage.getItem("token")) {
          this.getStudentsList();
          this.getTasks();

        } else {
          alert("Log in to see the view");
          window.location.href = "/";
        }
      }

    getStudentsList(){
        getStudents().then((data) => {
            this.setState(() => ({
                students: data,
                loaded: true
            }))
        })
        .catch( (err) =>
            alert(err.message)
        )
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
                tasks_loaded: true,
              };
            });
          });
      }
      
      // getGrades(){
      //   this.state.tasks.map( task => {
      //     fetch(task.url + "grades/", {
      //       method: "GET",
      //       headers: {
      //         Authorization: `Token ${localStorage.getItem("token")}`,
      //       },
      //     })
      //     .then((response) => {
      //       if (response.status > 400) {
      //         return this.setState(() => {
      //           return { placeholder: "Something went wrong!" };
      //         });
      //       }
      //       return response.json();
      //     })
      //     .then((data) => {
      //       data.grades.map((grade) =>{
      //         this.setState((state)=> {
      //           if(state.grades.has(task.url + grade.student));
      //           state.grades = [...state.grades, { key: task.url +"_" + grade.student,
      //           value: grade.value}];
      //           // map[task.url + grade.student] = grade.value;
      //           // state.grades[task.url + grade.student] = grade.value;
      //           return{
      //             grades: state.grades,
      //           }
      //         })
      //       })
      //     });
      //   })
      // }
      // getStudentGradeForTask(task_id, student_id){
      //   fetch(`/api/tasks/${task_id}/grades`, {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Token ${localStorage.getItem("token")}`,
      //     },
      //   })
      //     .then((res) => res.json())
      //     .then((data) => {
      //       var grade =  data.grades.filter((tuple) => {
      //         return tuple.student == student_id;
      //       }) 
      //       var toReturn;
      //       grade.length > 0 ? toReturn = grade[0].value : toReturn = '-';
      //       console.log(toReturn)
      //       return toReturn
      //     })
      //     .catch((err) => console.log(err));
      // }

      getTasksGradesList(student_id){

          let gradesPerTask=[];
          this.state.tasks.map( task => {
            return fetch(task.url + "grades/", {
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
              var grade
              data == [] ? grade = [] : grade =  data.grades.filter((tuple) => {
                return tuple.student == student_id;
              }) 
              return grade.length > 0 ? gradesPerTask.push(grade[0].value) : gradesPerTask.push("-");
            });
          })
          return Promise.all([gradesPerTask])
          .then(data => {
            return data;
          })
      }

    prepareView() {
        if (this.state.loaded == false) {
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
                    return (
                        <LeaderboardRow
                            key = {this.state.students.indexOf(student)}
                            id = {this.state.students.indexOf(student)}
                            name = {student.user.first_name + " " + student.user.last_name}
                            grades = {this.getTasksGradesList(student.user.id)}
                            total = {90}
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