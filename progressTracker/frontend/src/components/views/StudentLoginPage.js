import React, { Component, Fragment} from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import LoginForm from '../layout/LoginForm'


export class StudentLoginPage extends Component {
    constructor(props) {
		super(props)

        this.state = {
			 logged_in : !!localStorage.getItem('token'),
			 username : '',
			 password : '',
             error: '',
		}

        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
	}

    componentDidMount(){
		if(localStorage.getItem('token')){
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

    handlePasswordChange = (e) => {
        this.setState({
            password : e.target.value
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
            if(json.non_field_errors)
                this.setState({
                    error: json.non_field_errors[0]
                })
            if(json.user.is_student){
                localStorage.setItem('token', json.token);
                sessionStorage.setItem('isStudent', true);

                this.setState({
                    username : json.user.username,
                    password : json.user.password
                })

                window.location.href="/student/courses";
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
                <Header button1_text="Teacher" button2_text="Main Page" button1_path="/teacher/login" button2_path="/"/>
                <Container fluid>
                    <Row className="mt-4 ml-3">
                        <Col xs={6} className="heading login_heading">Log into student's account</Col>     
                        <Col></Col>                                           
                    </Row>
                    <Row className="mt-4 ml-3">
                        <Col xs={6}><LoginForm 
                            handleLogin = {this.handleLogin}
                            handleLoginChange = {this.handleLoginChange}
                            handlePasswordChange = {this.handlePasswordChange}
                            username = {username}
                            password = {password}/>
                            {this.state.error != ''? <h3 className="card-title pt-3">Logowanie się nie powiodło: {this.state.error};</h3> : <p></p>}
                        </Col>
                        <Col xs={6}>
                            <Row className="mt-2 ml-3">
                            <Col className="slogan"><img src="../../static/images/slogan1.png"  alt="slogan" /></Col> 
                            </Row>
                            <Row className="mt-5 ml-3">
                            <Col className="log_image"><img src="../../static/images/breaking_rocks.png"  alt="sleeping students furing lecture" /></Col>
                            </Row>
                        </Col>
                     </Row>
                </Container>  
                <Footer/>
            </Fragment>
            
        )
    }
}

export default StudentLoginPage

