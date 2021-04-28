import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Table } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import StudentRow from '../layout/StudentRow';
import {getStudents, getTask} from '../functions/getData'

export class StudentsList extends Component {
    constructor(props) {
		super(props)

        this.state = {
             name: localStorage.getItem('courseName'),
			 students: [],
             loaded: false,
		}
	}

    componentDidMount(){
        if(localStorage.getItem('token')){
            getStudents().then((data) => {
                this.setState(() => ({
                    students: data,
                    loaded: true
                }))
            })
            .catch( (err) =>
                alert(err.message)
            )
            // fetch(localStorage.getItem('courseUrl')+'students', {
            //     method : 'GET',
            //     headers : {
            //         Authorization : `Token ${localStorage.getItem('token')}`
            //     }
            // })
            // .then(response => {
            //     if (response.status > 400) {
            //         return this.setState(() => {
            //         return { placeholder: "Something went wrong!" };
            //     });}
            //     return response.json();
            // })
            // .then(data => {
            //     this.setState(() => {
            //     return {
            //         students: data.students,
            //         loaded: true
            //     };});
            // });

        }      
    }

    render() {
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={3}></Col>  
                        <Col xs={6} className="heading login_heading text-left">{this.state.name}</Col>                             
                    </Row>

                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
                            <Sidebar/>
                        </Col>

                        <Col xs={10}>
                                <Table striped className="students-list">
                                    <thead>
                                        <tr>
                                        <th></th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Index_nr</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.students.map(student=> {
                                            return (
                                                <StudentRow 
                                                key = {this.state.students.indexOf(student)}
                                                id = {this.state.students.indexOf(student)}
                                                first_name = {student.user.first_name}
                                                last_name = {student.user.last_name}
                                                email = {student.user.email}
                                                index_nr = {student.index_nr}
                                                />
                                            );
                                        })} 
                                    </tbody>
                                </Table>
                        </Col>
                    </Row>
                    
                </Container>    
                <Footer/>               
            </Fragment>
        )
    }
}

export default StudentsList
