import React, {Component, Fragment} from 'react'
import {Container, Row, Col} from 'reactstrap';
import AddAchievementForm from '../layout/forms/AddAchievementForm'
import Header from '../layout/Header';
import {checkUser, extractID, getArgs, getElement} from '../functions/helpers';
import toast from 'react-hot-toast';

export class AddAchievement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      rule: '',
      x: 0,
      selectedX: null,
      tasks: [],
      y: 0,
      z: 0
    }

    this.handleName = this.handleName.bind(this);
    this.handleRule = this.handleRule.bind(this);
    this.handleX = this.handleX.bind(this);
    this.handleSelectX = this.handleSelectX.bind(this);
    this.handleY = this.handleY.bind(this);
  }

  componentDidMount() {
    checkUser("/student/courses");
    this.getTasks();
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

  handleName = event => {
    this.setState({
      name: event.target.value
    })
  }

  handleRule = event => {
    this.setState({
      rule: event
    })
  }

  handleX = event => {
    this.setState({
      x: event.target.value
    })
  }

  handleSelectX = event => {
    this.setState({
      selectedX: event
    })
  }

  handleY = event => {
    this.setState({
      y: event.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/achievements/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.prepareData())
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.kind == this.state.rule.value) {
          toast.success(`Achievement added successfully`);
          // window.location.href="/teacher/course/achievements";
        }
      })
      .catch(err => {console.log(err); toast.error(`Error occured.`);});
  }

  prepareData() {
    const courseUrl = localStorage.getItem('courseUrl');
    const course = extractID(courseUrl);

    const args = getArgs(this.state.rule.value, this.state.x, this.state.selectedX, this.state.y);
    if (args === "") {
      return {
        name: this.state.name,
        course: course,
        kind: this.state.rule.value
      }
    } else {
        return {
          name: this.state.name,
          course: course,
          kind: this.state.rule.value,
          args: args
        }
      }
  }

  render() {
    const {name, rule, x, selectedX, tasks, y, z} = this.state;
    return (
      <Fragment>
        <Header button1_text="Achievements" button2_text="Log Out" button1_path="/teacher/course/achievements"
                button2_path="/" is_logout={true}/>
        <Container fluid>
          <Row sm={3} className="mt-4 mb-5 ml-3">
            <Col sm={5} className="heading text-center login_heading">Create achievement</Col>
          </Row>
          <Row className="mt-2">
            <Col sm={1}></Col>
            <Col sm={10} className="text-center">
              <AddAchievementForm
                buttonText="Create"
                handleName={this.handleName}
                handleRule={this.handleRule}
                handleX={this.handleX}
                handleSelectX={this.handleSelectX}
                handleY={this.handleY}
                handleSubmit={this.handleSubmit}
                name={name}
                rule={rule}
                x={x}
                selectedX={selectedX}
                tasks={tasks}
                y={y}
                readOnly={false}
              />
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

export default AddAchievement
