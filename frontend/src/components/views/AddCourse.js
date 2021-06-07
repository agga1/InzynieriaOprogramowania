import React, {  Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import AddCourseForm from '../layout/forms/AddCourseForm'
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import { checkUser } from '../functions/helpers';

export class AddCourse extends Component {
  constructor(props){
    super(props)

    this.state = {
      name : '',
      teacher : '',
      teacher_id : '',
      description: "",
      pass_threshold : '',
      chosen_students : [],
    }

    this.handleName = this.handleName.bind(this);
    this.handlePassThreshold = this.handlePassThreshold.bind(this);
    this.handleStudents = this.handleStudents.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    checkUser("/student/courses").then((data) => {
      if(data != null){
        this.setState({
          teacher : data.user.first_name + " " + data.user.last_name,
          teacher_id: data.user.id
        });
      }
    })
  }

  handleName = event => {
    this.setState({
      name : event.target.value
    })
  }

  handlePassThreshold = (e) => {
    this.setState({
      pass_threshold : e.target.value
    })
  }

  handleStudents = (e) => {
    this.setState({chosen_students: e});
  }

  handleDescription = event => {
    this.setState({
      description : event.target.value
    })
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    fetch('/api/courses/', {
      method : 'POST',
      headers : {
        Authorization : `Token ${localStorage.getItem('token')}`,
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(this.prepareData())
    })
      .then(res => res.json())
      .then(resp =>{
        if(resp.name == this.state.name){
          alert("Course "+this.state.name+" added succesfully.\nteacher: "
            +this.state.teacher+"\n"
            +"pass threshold: "+this.state.pass_threshold);
          window.location.href = "/teacher/courses";
        }
        else{
          alert("Course not added.")
        }

      })
      .catch(err => console.log(err));
  }

  prepareData(){
    var students_id = this.state.chosen_students;
    students_id = students_id.map(e => e.value);
    return{
      name: this.state.name,
      teacher: this.state.teacher_id,
      student: students_id,
      description: this.state.description,
      pass_threshold: this.state.pass_threshold
    }
  }


  render() {
    const { name, pass_threshold, description, chosen_students} = this.state;
    const coursesPath =  localStorage.getItem("isStudent") === "true" ? "/student/courses" : "/teacher/courses";
    return (
      <Fragment>
        <Header button1_text="My Courses" button2_text="Log Out" button1_path={coursesPath} button2_path="/" is_logou={true}/>
        <Container fluid>
          <Row className="mt-4 mb-4">
            <Col xs={12} className="heading text-center login_heading">Add new course</Col>
          </Row>
          <Row className="mt-2 mb-5">
            <Col xs={2}></Col>
            <Col xs={8} >
              <AddCourseForm
                buttonText="Add course"
                handleName = {this.handleName}
                handlePassThreshold = {this.handlePassThreshold}
                handleStudents = {this.handleStudents}
                handleSubmit = {this.handleSubmit}
                handleDescription = {this.handleDescription}
                teacher = {this.state.teacher}
                name = {name}
                description = {description}
                pass_threshold = {pass_threshold}
                chosen_students = {chosen_students}
                readOnly={false}
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

export default AddCourse
