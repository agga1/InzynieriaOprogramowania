import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import AddGroupForm from '../layout/forms/AddGroupForm'
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import {checkUser, extractID} from '../functions/helpers';
import toast from 'react-hot-toast';

export class AddGroup extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: '',
      chosenStudents: [],
    }

    this.handleName = this.handleName.bind(this);
    this.handleStudents = this.handleStudents.bind(this);
  }

  componentDidMount(){
    checkUser("/student/courses");
  }

  handleName = event => {
    this.setState({
      name: event.target.value
    })
  }

  handleStudents = event => {
    this.setState({
      chosenStudents: event.map(student => student.value)
    })
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    fetch('/api/groups/', {
      method : 'POST',
      headers : {
        Authorization : `Token ${localStorage.getItem('token')}`,
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(this.prepareData())
    })
      .then(res => res.json())
      .then(resp => {
        if(resp.name === this.state.name) {
          toast.success(`Group ${this.state.name} added successfully.\n`);
          window.location.href="/teacher/course/groups";
        }
      })
      .catch(err => console.log(err));
  }

  prepareData() {
    const courseID = extractID(localStorage.getItem('courseUrl'));

    return {
      name: this.state.name,
      course: courseID,
      student: this.state.chosenStudents
    }
  }

  render() {
    const { name, chosenStudents} = this.state;
    return (
      <Fragment>
        <Header button1_text="Groups" button2_text="Log Out" button1_path="/teacher/course/groups" button2_path="/" is_logout={true}/>
        <Container fluid>
          <Row xs={3} className="mt-4 mb-5 ml-3">
            <Col xs={3} className="heading text-center login_heading">Add group</Col>

          </Row>
          <Row className="mt-2">
            <Col xs={1}></Col>
            <Col xs={10} className="text-center">
              <AddGroupForm
                buttonText = "Create"
                handleName = {this.handleName}
                handleStudents = {this.handleStudents}
                handleSubmit = {this.handleSubmit}
                name = {name}
                chosenStudents = {chosenStudents}
              />
            </Col>
          </Row>
          <Row className="mb-5 mt-5" />
        </Container>
        <Footer/>
      </Fragment>
    )
  }
}

export default AddGroup
