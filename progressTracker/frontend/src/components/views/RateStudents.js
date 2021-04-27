import React, { Component, Fragment } from 'react'
import {Container, Row, Col, Table} from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import Modal from '../layout/RateStudentModal';


export class RateStudents extends Component {
    constructor(props) {
		super(props)

        this.state = {
             task: {},
			 students: [],
             grades: [],
             show: false,
             loaded: false,
             student_id: '',
             rate: '',
             title: "Rate student"
		}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
	}

    componentDidMount(){
        if(localStorage.getItem('token')){
            this.getTask();
            this.getStudentsGrades();
            this.getStudents();
        }      
        else{
            alert('Log into to see the view');
            window.location.href="/";
        }
    }

    getStudents(){
        if(sessionStorage.getItem('isStudent')=='false'){
            fetch(localStorage.getItem('courseUrl')+'students', {
                method : 'GET',
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                    return { placeholder: "Something went wrong!" };
                });}
                return response.json();
            })
            .then(data => {
    
                this.setState(() => {
                return {
                    students: data.students,
                    loaded: true
                };});
            });
        }
        else{
            alert('Only teacher can rate students!!!');
        }
    }


    getTask(){
        if(sessionStorage.getItem('isStudent')=='false'){
            fetch(localStorage.getItem('taskUrl'), {
                method : 'GET',
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                    return { placeholder: "Something went wrong!" };
                });}
                return response.json();
            })
            .then(data => {
                this.setState(() => {
                return {
                    task: data
                };});
            });
        }
        else{
            alert('Only teacher can rate students!!!');
        }
    }

    getStudentsGrades(){
        if(sessionStorage.getItem('isStudent')=='false'){
            fetch(localStorage.getItem('taskUrl')+'grades', {
                method : 'GET',
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                    return { placeholder: "Something went wrong!" };
                });}
                return response.json();
            })
            .then(data => {
                console.log(data.grades)
                this.setState(() => {
                return {
                    grades: data.grades,
                };});
            });
        }
        else{
            alert('Only teacher can rate students!!!');
        }
        
    }

    showModal = (student) => {
        this.setState((state) => ({
            student_id: student.user.id,
            rate: '',
            show: !state.show,
            title: "Rate "+student.user.first_name+ " "+student.user.last_name
        }));
    }

    handleCancel = () => {
        this.setState((state) => ({
            student_id: '',
            rate: '',
            show: !state.show,
            title: "Rate student"
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.rate < this.state.task.grade_max && this.state.rate > this.state.task.grade_min){
            fetch(localStorage.getItem('taskUrl')+'add_grade/', {
                method : 'POST',
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`,
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    students: [this.state.student_id],
                    grades: [this.state.rate]
                })
            })
            .then(res => res.json())
            .then(
                this.handleCancel()
            )
            .catch(err => console.log(err));
        }
    }

    handleChange = (e) =>{
        this.setState({
            rate: e.target.value
        })
    }


    getGrade(student){
        for(var grade in this.state.grades){
            if(this.state.grades[grade].student == student.user.id){
                return this.state.grades[grade].value;
            }
        }
        return "-";
    }

    prepareView() {
        if (this.state.loaded == false) {
          return (
            <Col xs={12} className="mb-5 mt-5">
              <Spinner />
            </Col>
          );
        } else {
          return (
            <Col xs={10} className="pr-4">
                <Table striped className="students-list">
                    <thead>
                        <tr>
                        <th className="td-sm">no.</th>
                        <th colSpan="3">Name</th>
                        <th className="td-sm">Points</th>
                        <th className="td-sm">Rate</th>
                        <th className="td-sm">Orderxd</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map(student=> {
                            return (
                            <tr key={student.user.id}>
                                <td className="td-sm" scope="row">{this.state.students.indexOf(student)}</td>
                                <td colSpan="3">{student.user.first_name} {student.user.last_name}</td>
                                <td className="td-sm">{this.getGrade(student)}</td>
                                <td className="td-sm"><a className='btn' role="button" aria-pressed="false" onClick={() => this.showModal(student)}>Rate</a></td>
                                <td className="td-sm"><a className='btn btn-sm' role="button" aria-pressed="true" >b</a></td>
                            </tr>  
                            );
                        })} 
                    </tbody>
                </Table>
        </Col>
          );
        }
      }


    render() {
        const {rate} = this.state;
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Modal
                        title={this.state.title}
                        show={this.state.show}
                        handleSubmit = {this.handleSubmit}
                        handleCancel = {this.handleCancel}
                        handleChange = {this.handleChange}
                        rate = {rate}
                        max_grade = {this.state.task.grade_max}
                    />
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={3}/>
                        <Col xs={6} className="heading login_heading text-left">{this.state.task.name}</Col>                             
                    </Row>

                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
                            <Sidebar/>
                        </Col>
                        {this.prepareView()}                        
                    </Row>
                    
                </Container>    
                <Footer/>               
            </Fragment>
        )
    }
}

export default RateStudents
