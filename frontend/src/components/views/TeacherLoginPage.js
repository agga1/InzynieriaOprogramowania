import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import LoginForm from '../layout/forms/LoginForm'
import { getElement } from '../functions/helpers';


export class TeacherLoginPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      logged_in : localStorage.getItem('token') ? true : false,
      username : '',
      password : '',
      error: ''
   }

   this.handleLoginChange = this.handleLoginChange.bind(this);
   this.handlePasswordChange = this.handlePasswordChange.bind(this);
   this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount(){
    if(this.state.logged_in) {
      getElement('/api/auth/login')
        .then(resp => {
          if(resp.is_student){
            this.setState({
              username : resp.username
            })
            window.location.href="/student/courses"
          }
        })
        .catch(err => console.log(err));
    }
  }

  handleLoginChange = event => {
    this.setState({
      username : event.target.value,
      error: ''
    })
  }

  handlePasswordChange = (e) => {
    this.setState({
      password : e.target.value,
      error: ''
    })
  }
   
  handleLogin = (e, data) => {
    e.preventDefault();
    fetch('/api/auth/login', {
      crossDomain : true,
      withCredentials : true,
      async : true,
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
      if(json.non_field_errors || json.user.is_student)
        this.setState({
          error: json.non_field_errors ? "incorrect credentials!" : "no permission to login as teacher!",
          username: '',
          password: ''
        })
      else {
        localStorage.setItem('token', json.token);
        localStorage.setItem('isStudent', false);

        this.setState({
          username : json.user.username,
          password : json.user.password
        })

        window.location.href="/teacher/courses";
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    const { username , password} = this.state;

    return (
      <Fragment>
        <Header button1_text="Student" button2_text="Main Page" button1_path="/student/login" button2_path="/"/>
        <Container fluid className="">
          <Row className="mt-4 ml-md-3">
            <Col lg={6} md={12} className="heading login_heading">Log into teacher's account</Col>
          </Row>
          <Row className="mt-4 ml-md-3">
            <Col sm={6} xs={12}><LoginForm
            handleLogin = {this.handleLogin}
            handleLoginChange = {this.handleLoginChange}
            handlePasswordChange = {this.handlePasswordChange}
            username = {username}
            password = {password}
            error = {this.state.error}/>
            </Col>
            <Col sm={6} xs={12}>
              <Row className="mt-2">
              <Col className="slogan"><img src="../../static/images/slogan2.png" className="responsive" alt="slogan" /></Col>
              </Row>
              <Row className="mt-5 mb-3">
              <Col className="log_image"><img src="../../static/images/teaching_meme.png" className="responsive" alt="sleeping students furing lecture" /></Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer/>
      </Fragment>
    )
  }
}

export default TeacherLoginPage
