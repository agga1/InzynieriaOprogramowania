import React, {Component, Fragment} from 'react'
import {Container, Row, Col} from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import Button from '../layout/Button';
import {ProgressBar} from "react-bootstrap";
import AchievementIcon from "../layout/icons/AchievementIcon";
import { getElement } from '../functions/helpers';
import toast from 'react-hot-toast';

export class Progress extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: localStorage.getItem("courseName"),
      studentId: localStorage.getItem("studentId"),
      achievements: [],
      tasks: [],
      main_tasks: [],
      main_tasks_len: -1,
      points: 0,
      total: 0,
      loaded: false,
      grades_loaded: false,
    }
  }

  getPointsForMainTasks() { 
    return getElement(localStorage.getItem("courseUrl") + "main_tasks")
    .then((data1) => {
      let main_tasks = data1.tasks;
      this.setState(() => ({
        main_tasks: main_tasks,
        main_tasks_len: main_tasks.length,
        grades_loaded: main_tasks.length === 0 ? true : this.state.grades_loaded,
        }
      ))
      let counter = 0;
      let grades_list = this.state.grades;
      main_tasks.map( task => {
      return getElement(task.url + "grades/")
      .then((data2) => {
        let points = 0;
        counter++;
        data2.grades.map((grade) =>{
              if(grade.student == this.state.studentId)
                points += grade.value;
          })
          this.setState(() => ({
            grades: grades_list,
            grades_loaded: counter == this.state.main_tasks_len,
            total: this.state.total + task.grade_max,
            points: this.state.points + points,
            }
          ))
        })      
      })
   })
}

  setLevels() {
    let grade = (this.state.points * 100.0) / this.state.total;
    let breaks = [50, 20, 20, 10];
    let levels_values = [];
    for (let b of breaks) {
      if (grade >= b) {
        levels_values.push(b);
        grade -= b;
      } else {
        levels_values.push(grade);
        grade = 0;
      }
    }
    return levels_values;
  }

  getAchievements() {
    getElement(localStorage.getItem("courseUrl") + "achievements")
    .then((data) => {
      this.setState(() => {
        return {
          achievements: data.achievements.earned,
          loaded: true,
        };
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

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.getTasks();
      this.getPointsForMainTasks()
      this.getAchievements();
    } else {
      toast.error('Log into to see the view');
      window.location.href = "/";
    }
  }

  prepareProgressBar(levels_values){
    if(this.state.main_tasks_len === 0){
      return (
        <Row className="pr-5 pl-5 ml-2 mb-4">
            <Col xs={12} className="pr-5">
              <h1 className="heading">We can not calculate your progress because no tasks are asigned to this course</h1>
            </Col>
        </Row>
      );
    }else{
      let grade = (this.state.points * 100.0) / this.state.total;
      return (
        <Row className="pr-5 pl-5 ml-2 mb-4">
          <Col xs={10} className="pr-5">
            <ProgressBar className="my-progressbar">
              <ProgressBar now={`${levels_values[0]}`} animated striped variant="danger" label={`Not enough!`}
                           key={1}/>
              <ProgressBar now={`${levels_values[1]}`} animated striped variant="warning" label={`Ok`} key={2}/>
              <ProgressBar now={`${levels_values[2]}`} animated striped variant="info" label={`Good`} key={3}/>
              <ProgressBar now={`${levels_values[3]}`} animated striped variant="success" label={`Very Good`}
                           key={4}/>
            </ProgressBar>
          </Col>
          <Col xs={2} className="pr-5">
            <h1 className="heading max-points">{Math.round(grade)}%</h1>
          </Col>
        </Row>
      )
    }
  }

  prepareView() {
    if (this.state.loaded === false || this.state.grades_loaded === false) {
      return (
        <Col xs={10} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    }
    else {
      let levels_values = this.setLevels();
      return (
        <Col md={10} className="pr-4">
          {this.prepareProgressBar(levels_values)}
          <Row className="p-2">
            {this.state.achievements.map((achievement) => {
              return (
                <Col
                  xs={12}
                  key={achievement.id}
                >
                  <AchievementIcon
                    kind={achievement.kind}
                    args={achievement.args}
                    name={achievement.name}
                    tasks={this.state.tasks}
                  />
                </Col>
              );
            })}
          </Row>
          <Row className="pr-5 pl-5 mb-4">
            <Col xs={7}>

            </Col>
            <Col xs={5} className="mt-4 pr-5 text-right">
              <Button path="/student/course/not-earned-achievements" text="Achievements to get"/>
            </Col>
          </Row>
        </Col>
      );
    }
  }


  render() {
    return (
      <Fragment>
        <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/"
                is_logout={true}/>
        <Container fluid>
          <Row className="mt-4 mb-5 ml-3">
            <Col md={2}/>
            <Col md={10} className="task-heading title text-left">Progress</Col>
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

export default Progress
