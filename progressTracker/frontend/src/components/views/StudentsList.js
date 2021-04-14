import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Table } from 'reactstrap';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import StudentRow from '../layout/StudentRow';

export class StudentsList extends Component {
    constructor(props) {
		super(props)

        this.state = {
             name: '',
			 students: [],
             loaded: false,
		}
        this.handleLogout = this.handleLogout.bind(this);
	}

    componentDidMount(){
        console.log(localStorage.getItem('token'))
        if(localStorage.getItem('token')){
            fetch(localStorage.getItem('url')+'students', {
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

            fetch(localStorage.getItem('url'), {
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
            .then(json => {
                this.setState(() => {
                return {
                    name: json.name
                };});
            });
        }      
    }

    handleLogout = () => {
        fetch('/api/auth/logout', {
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
		localStorage.removeItem('token');
	}

    render() {
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" button2_handle={this.handleLogout}/>
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
                                                index_nr = {student.index}
                                                />
                                            );
                                        })} 
                                    </tbody>
                                </Table>
                        </Col>
                    </Row>
                    
                </Container>                   
            </Fragment>
        )
    }
}

export default StudentsList
