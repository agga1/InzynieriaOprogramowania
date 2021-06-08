import React, {Component, Fragment} from 'react'
import {Container, Row, Col} from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import Button from '../layout/Button';
import AchievementIcon from "../layout/icons/AchievementIcon";
import {getElement} from '../functions/helpers';
import toast from 'react-hot-toast';

export class Achievements extends Component {
  constructor(props) {
    super(props)

    this.state = {
      achievements: [],
      tasks: [],
      loaded: false,
    }
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getTasks();
      this.getAchievements();
    } else {
      toast.error("Log in to see the view");
      window.location.href = "/";
    }
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

  handleCancel = name => {
    let id = 0;
    for (let i=0; i<this.state.achievements.length; i++) {
      if (name === this.state.achievements[i].name) {
        id = this.state.achievements[i].id;
        break;
      }
    }

    fetch(`/api/achievements/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    })
      .then(_ => {
        this.setState(() => {
          return {
            loaded: false
          };
        });
        this.getAchievements()
      })
      .catch(err => console.log(err));
  }

  getAchievements() {
    getElement(localStorage.getItem("courseUrl") + "achievements")
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
        <Col md={12} className="mb-5 mt-5">
          <Spinner/>
        </Col>
      );
    } else {
      return (
        <Col>
          <Row className="p-2">
            {this.state.achievements.length > 0 ?
              this.state.achievements.map((achievement) => {
                return (
                  <Col
                    xs={12}
                    key={achievement.id}
                  >
                    <AchievementIcon
                      kind={achievement.kind}
                      args={achievement.args}
                      name={achievement.name}
                      handleCancel={this.handleCancel}
                      tasks={this.state.tasks}
                    />
                  </Col>
                );})
              :
              (<Col xs={9} className="mb-5 mt-5">
            <h1 className="heading">There is no achievements in course {this.state.name}</h1>
            </Col> )
                
            }
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
            <Col md={2}/>
            <Col md={10} className="task-heading title text-left">Achievements</Col>
          </Row>
          <Row>
            <Col md={2} className="ml-md-0 pl-md-0">
              <Sidebar/>
            </Col>
            <Col md={10}>{this.prepareView()}</Col>
          </Row>
        </Container>

        <Footer/>
      </Fragment>
    )
  }
}

export default Achievements
