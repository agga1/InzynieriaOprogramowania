import React, {Component, Fragment} from 'react'
import {Container, Row, Col} from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import {getTask} from '../functions/helpers'
import Button from '../layout/Button';
import AchievementIcon from "../layout/AchievementIcon";

export class Achievements extends Component {
  constructor(props) {
    super(props)

    this.state = {
      achievements: [],
      loaded: false,
    }
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getAchievements();
    } else {
      alert("Log in to see the view");
      window.location.href = "/";
    }
  }

  getAchievements() {
    fetch(localStorage.getItem("courseUrl") + "achievements", {
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
          achievements: data.achievements,
          loaded: true,
        };
      });
    });
  }

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Spinner/>
        </Col>
      );
    } else {
      return (
        <Col>
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
            <Col xs={7}></Col>
            <Col xs={5} className="mt-4 pr-5 text-right">
              <Button path="/teacher/achievement/add" text="Add achievement"/>
            </Col>
          </Row>
        </Col>
      );
    }
  }


  render() {
    return (
      <Fragment>
        <Header button1_text="My Courses" button2_text="Log Out" button1_path="/teacher/courses" button2_path="/"
                is_logout={true}/>
        <Container fluid>
          <Row className="mt-4 mb-5 ml-3">
            <Col xs={2}/>
            <Col xs={10} className="task-heading title text-left">Achievements</Col>
          </Row>
          <Row>
            <Col xs={2} className="ml-0 pl-0">
              <Sidebar/>
            </Col>
            <Col xs={10}>{this.prepareView()}</Col>
          </Row>
        </Container>

        <Footer/>
      </Fragment>
    )
  }
}

export default Achievements
