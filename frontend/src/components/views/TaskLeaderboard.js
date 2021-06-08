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


export class TasksLeaderboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
        name: '',
        students: [],
        tasks: [],
        tasks_len: -1,
        grades: new Map(),
        total:new Map(),
        max: 0,
        loaded: false,
        }
	}

    getChildren() {
        return getElement(localStorage.getItem("taskUrl") + "children")
            .then((data) => {
                return data.children;
            });
    }

    getTaskDetails() {
        getElement(localStorage.getItem('taskUrl')).then((data) => {
            this.setState(() => ({
              name: data.name,
              id: data.id,
              max: data.grade_max
            }))
          })
    }

    getTotal(){
        let total_map = this.state.total;
        return getElement("/api/tasks/" + this.state.id + "/grades")
          .then((data) => {
            data.grades.map((grade) =>{
              if(!total_map.has(grade.student)){
                total_map.set(grade.student, grade.value);
              }
            })
            this.setState(() => ({
              total: total_map
              }
            ))
        })
    }
    getGradesMap(tasks) {
        let grades_map = this.state.grades;
        tasks.map( task => {
        return getElement("/api/tasks/" + task.id + "/grades")
          .then((data) => {
            data.grades.map((grade) =>{
              if(!grades_map.has(task.name + "_" + grade.student)){
                grades_map.set(task.name +"_" + grade.student, grade.value);
              }
            })
            this.setState(() => ({
              grades: grades_map,
              }
            ))
          })
        })
    }

    getAllGrades(student_id) {
        let list = [];
        this.state.tasks.map(task => {
          var key = task.name + "_" + student_id
          if (this.state.grades.has(key)){
            var value = this.state.grades.get(key);
            list.push({"key": key, "value": value});
          }
          else
            list.push({"key": key, "value": 0});
        });
        return list;
      }

    getData() {
        let students = getStudents();
        let children = this.getChildren();

        Promise.all([children, students])
        .then(([children, students]) => {
            this.getGradesMap(children);
            this.getTotal()
            this.setState(() => ({
            students: students,
            tasks: children,
            tasks_len: Object.keys(children).length,
            loaded: true,
            }));
        })
        .catch((err) => console.log(err.message));
        }

    componentDidMount() {
        if (localStorage.getItem("token")) {
        this.getTaskDetails();
        this.getData();
        } else {
        toast.error("Log into to see the view");
        window.location.href = "/";
        }
    }

 

  prepareData(){
    const data = {
      columns: [],
      rows: [],
    }
    data.columns.push({
      label: 'Name',
      field: 'name',
    },)
    data.columns.push({
      label: 'Progress',
      field: 'progress',
    },)
    this.state.tasks.map( (task) => {
      data.columns.push({
        label: task.name,
        field: task.name,
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
      result.map((res) => {
        var label = res["key"].split('_')[0];
        var val = res["value"];
        obj[[label]]=val;
      })
      this.state.total.has(student.user.id) ? obj["total"]= this.state.total.get(student.user.id) : obj["total"]=0;
      obj["progress"] = <ProgressBar animated variant="warning" now={`${(this.state.total.get(student.user.id)*100)/this.state.max}`} />
      data.rows.push(obj)
    })

    return data;
  }

  prepareView() {
    if (this.state.loaded === false) {
      return (
        <Col xs={10} className="mb-3 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      return (
        <Col xs={10} className="pr-4">
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
            <Col xs={2}></Col>
            <Col xs={9} className="heading title text-left">{this.state.name}</Col>
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

export default TasksLeaderboard