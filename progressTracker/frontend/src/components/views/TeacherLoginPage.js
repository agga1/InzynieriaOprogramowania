import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
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
       this.handleLogout = this.handleLogout.bind(this);
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
               this.setState({ 
                   username : resp.username,
                })
           })
           .catch(err => console.log(err));
       }
   }

   handleLoginChange = event => {
       this.setState({
           username : event.target.value
       })
   }

   handleLogout = () => {
    fetch('api/auth/logout', {
        crossDomain : true,
        withCredentials : true,
        async : true,
        method : 'POST',
        headers : {
            Authorization : `Token ${localStorage.getItem('token')}`
        },
    })
    .catch(error => {
        console.log(error)
    })
    this.setState({logged_in : false, username : '', password: ''})
}

   handlePasswordChange = (e) => {
       this.setState({
           password : e.target.value
       })
   }

   handleLogin = (e, data) => {
       e.preventDefault();
       console.log(data)
       fetch('api/auth/login', {
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
           localStorage.setItem('token', json.token);
           this.setState({
               username : json.user.username,
               password : json.user.password
           })
       })
       .catch(error => {
           console.log(error)
       })
   }

    render() {
        const { logged_in, username , password} = this.state;
        
        const logged_out_nav = (
            <ul>
                <li onClick={this.handleLogout}>Logout</li>
            </ul>
        );

        const logged_in_nav = (
            <p>Login</p>
        );


        return (
            <Fragment>
                <Header button1_text="Teacher" button2_text="MainPage" button1_path="/teacher_login" button2_path="/"/>
                <Container fluid className="">
                    <Row className="mt-4 ml-3">
                        <Col xs={6} className="heading login_heading">Log into teacher's account</Col>     
                        <Col></Col>                                           
                    </Row>
                    <Row className="mt-4 ml-3">
                        <Col xs={6}><LoginForm
                        logged_in = {logged_in}
                        handleLogin = {this.handleLogin}
                        handleLoginChange = {this.handleLoginChange}
                        handlePasswordChange = {this.handlePasswordChange}
                        username = {username}
                        password = {password}/>
                        </Col>
                        <Col className="slogan"><img src="../../static/images/slogan1.png"  alt="slogan" /></Col>
                       
                     </Row>
                     <Row className="mt-4 ml-3">
                        <Col xs={6}></Col>
                        <Col className="log_image"><img src="../../static/images/teaching_meme.png"  alt="sleeping students furing lecture" /></Col>
                     </Row>
                </Container>   
                <div>
                    {this.state.logged_in ? logged_out_nav : logged_in_nav}
                </div>
            </Fragment>
        )
    }
}

export default TeacherLoginPage
