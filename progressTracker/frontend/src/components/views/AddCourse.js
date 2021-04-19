import React, {  Component, Fragment } from 'react'
import { Container, Row, Col, Alert } from 'reactstrap';
import AddCourseForm from '../layout/AddCourseForm'
import Header from '../layout/Header';

export class AddCourse extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            name : '',
            teacher : '',
            teacher_id : '',
            pass_threshold : '',
            students : []
       }

        this.handleName = this.handleName.bind(this);
        this.handlePassThreshold = this.handlePassThreshold.bind(this);
        this.handleStudents = this.handleStudents.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        if(localStorage.getItem('token')){
            fetch('/api/auth/user', {
                method : 'GET',
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(resp => {
             if(!resp.is_student){
                 this.setState({ 
                     teacher : resp.username,
                     teacher_id :resp.id
                 })
                 
             }	
             else{
                alert('Only teacher can add courses');
                window.location.href="/student/courses";
            }
            })
            .catch(err => console.log(err));
        }
        else{
            alert('Log into to see the view');
            window.location.href="/";
        }

    }

    getStudents(){
        fetch('/api/students', {
            method : 'GET',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(resp => {
         if(!resp.is_student){
             this.setState({ 
                 teacher : resp.username,
                 teacher_id :resp.id
             })
             
         }	
         else{
            alert('Only teacher can add courses');
            window.location.href="/student/courses";
        }
        })
        .catch(err => console.log(err));

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
        this.setState({
            students : e.target.value
        })
    }

    handleSubmit = (e) =>{
       e.preventDefault();
       ReactDOM.render(
        <Alert color="success">
            Added new course: {this.state.name}\n 
            pass threshold: {this.state.pass_threshold}\n
            students: {this.state.students}
        </Alert>, document.getElementById('root')
       );
       alert('added new course: '+this.state.name+ ' '+ this.state.students);

    }
   


    render() {
        const { name, pass_threshold, students} = this.state;
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" button2_handle={this.handleLogout}/>
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={3}></Col> 
                        <Col xs={6} className="heading text-center login_heading">Add new course</Col>     
                                                                  
                    </Row>
                    <Row className="mt-2">
                        <Col xs={2}></Col>
                        <Col xs={8} className="text-center">
                        <AddCourseForm
                            handleName = {this.handleName}
                            handlePassThreshold = {this.handlePassThreshold}
                            handleStudents = {this.handleStudents}
                            handleSubmit = {this.handleSubmit}
                            name = {name}
                            teacher = "super teacher"
                            pass_threshold = {pass_threshold}
                            students = {students}
                        />
                        </Col>
                    </Row> 
                </Container>                   
            </Fragment>
        )
    }
}

export default AddCourse
