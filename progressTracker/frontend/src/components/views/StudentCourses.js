import React, { Component, Fragment } from 'react'
import CourseIcon from '../layout/CourseIcon';
import Header from '../layout/Header'

export class StudentCourses extends Component {

    constructor(props) {
		super(props)

        this.state = {
			 data: [],
             loaded: false,
		}
        this.handleLogout = this.handleLogout.bind(this);
	}

    componentDidMount(){
        console.log(localStorage.getItem('token'))
        if(localStorage.getItem('token')){
            fetch('/api/courses', {
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
                    data,
                    loaded: true
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
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/teacher/courses" button2_path="/" button2_handle={this.handleLogout}/>
                <Container fluid>
                    <Row className="mt-4 ml-3">
                        <Col xs={6} className="heading login_heading">My courses</Col>     
                        <Col></Col>                                           
                    </Row>
                    <Row className="mt-4 ml-3">
                        {/* {this.state.data.map(course=> {
                            return (
                                    <CourseIcon
                                course_name = {course.name}
                                teacher_name = {course.teacher_name}
                                course_details_path = "/10"
                                />
                            );
                        })} */}
                     </Row>
                </Container>                   
            </Fragment>
        )
    }
}

export default StudentCourses
