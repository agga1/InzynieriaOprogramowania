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

export class Progress extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: localStorage.getItem("courseName"),
      achievements: [],
      points: 0,
      total: 0,
      loaded: false,
    }
  }

  getTotal() {
    getElement(localStorage.getItem("courseUrl") + "main_tasks")
      .then((data) => {
        let total = 0;
        data = data.tasks;
        for (let i = 0; i < data.length; i++) {
          total += parseInt(data[i].grade_max);
        }
        this.setState(() => {
          return {
            total: total,
          };
        });
      });
  }

  getPoints() {
    getElement("/api/grades/")
      .then((data) => {
        let points = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].course_name === this.state.name) {
            points += parseInt(data[i].value);
          }
        }

        this.setState(() => {
          return {
            points: points
          };
        });

      });
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

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.getPoints();
      this.getTotal();
      this.getAchievements();
    } else {
      alert('Log into to see the view');
      window.location.href = "/";
    }
  }

  prepareView() {
    if (this.state.loaded === false) {
      return (
        <Col xs={10} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      let levels_values = this.setLevels();
      return (
        <Col xs={10} className="pr-4">
          <Row className="pr-5 pl-5 ml-2 mb-4">
            <Col xs={12} className="pr-5">
              <ProgressBar className="my-progressbar">
                <ProgressBar now={`${levels_values[0]}`} animated striped variant="danger" label={`Not enough!`}
                             key={1}/>
                <ProgressBar now={`${levels_values[1]}`} animated striped variant="warning" label={`Ok`} key={2}/>
                <ProgressBar now={`${levels_values[2]}`} animated striped variant="info" label={`Good`} key={3}/>
                <ProgressBar now={`${levels_values[3]}`} animated striped variant="success" label={`Very Good`}
                             key={4}/>
              </ProgressBar>
            </Col>
          </Row>
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
            <Col xs={2}/>
            <Col xs={10} className="task-heading title text-left">Progress</Col>
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

export default Progress
