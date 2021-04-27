import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import LoginForm from '../layout/LoginForm'


export class TeacherLoginPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            logged_in : localStorage.getItem('token') ? true : false,
            username : '',
            password : ''
       }

       this.handleLoginChange = this.handleLoginChange.bind(this);
       this.handlePasswordChange = this.handlePasswordChange.bind(this);
       this.handleLogin = this.handleLogin.bind(this);
   }

   componentDidMount(){
       if(this.state.logged_in){
           fetch('/api/auth/login', {
               method : 'GET',
               headers : {
                   Authorization : `Token ${localStorage.getItem('token')}`
               }
           })
           .then(res => res.json())
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
           username : event.target.value
       })
   }

   handlePasswordChange = (e) => {
       this.setState({
           password : e.target.value
       })
   }

   handleLogin = (e, data) => {
       e.preventDefault();
       console.log(data)
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
           if(!json.user.is_student){
            localStorage.setItem('token', json.token);
            sessionStorage.setItem('isStudent',false);
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
        const { logged_in, username , password} = this.state;
        
        return (
            <Fragment>
                <Header button1_text="Student" button2_text="Main Page" button1_path="/student/login" button2_path="/"/>
                <Container fluid className="">
                    <Row className="mt-4 ml-3">
                        <Col xs={6} className="heading login_heading">Log into teacher's account</Col>     
                        <Col></Col>                                           
                    </Row>
                    <Row className="mt-4 ml-3">
                        <Col xs={6}><LoginForm
                        handleLogin = {this.handleLogin}
                        handleLoginChange = {this.handleLoginChange}
                        handlePasswordChange = {this.handlePasswordChange}
                        username = {username}
                        password = {password}/>
                        </Col>
                        <Col xs={5}>
                            <Row className="mt-2">
                            <Col className="slogan"><img src="../../static/images/slogan2.png"  alt="slogan" /></Col> 
                            </Row>
                            <Row className="mt-5">
                            <Col className="log_image"><img src="../../static/images/teaching_meme.png"  alt="sleeping students furing lecture" /></Col>
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
