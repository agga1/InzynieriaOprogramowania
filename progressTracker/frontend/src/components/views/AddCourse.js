import React, {  Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
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
            students: [],
            chosen_students : [],
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
             if(resp.user.is_student!=false){
                 alert("Only teacher can add courses");
                 window.location.href="/student/courses";       
             }	
             else{
                this.setState({ 
                    teacher : resp.user.first_name + " " + resp.user.last_name,
                    teacher_id :resp.user.id
                });
                this.getStudents();
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
            this.setState({
                students : this.prepareStudents(resp)
            });    
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
        this.setState({chosen_students: e});
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
            }
        })
        .catch(err => console.log(err));
        }

    prepareData(){
        var students_id = this.state.chosen_students;
        students_id = students_id.map(e => e.value);
        if(students_id.length==0){
            students_id=[];
        }

        return{
            name: this.state.name,
            teacher: this.state.teacher_id,
            student: students_id,
            pass_threshold: this.state.pass_threshold
        }
    }

    prepareStudents(students){
        var tab = [];
        var student;
        for(student in students){
            tab.push({
                value: students[student].user.id,
                label: students[student].user.first_name + students[student].user.last_name+"; ["+students[student].user.email+"]"
            })
        }
        return tab
    }

    render() {
        const { name, pass_threshold, chosen_students} = this.state;
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" button2_handle={this.handleLogout}/>
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        
                        <Col xs={12} className="heading text-center login_heading">Add new course</Col>     
                                                                  
                    </Row>
                    <Row className="mt-2">
                        <Col xs={2}></Col>
                        <Col xs={8} >
                        <AddCourseForm
                            handleName = {this.handleName}
                            handlePassThreshold = {this.handlePassThreshold}
                            handleStudents = {this.handleStudents}
                            handleSubmit = {this.handleSubmit}
                            teacher = {this.state.teacher}
                            students = {this.state.students}
                            name = {name}
                            pass_threshold = {pass_threshold}
                            chosen_students = {chosen_students} 
                        />
                        </Col>
                    </Row> 
                </Container>                   
            </Fragment>
        )
    }
}

export default AddCourse
