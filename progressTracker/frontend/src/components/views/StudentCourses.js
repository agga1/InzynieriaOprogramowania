import React, { Component, Fragment } from 'react'
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
                <ul>
           {this.state.data.map(course=> {
            return (
              <li key={course.name}>
                {course.name}, {course.teacher}, {course.student}, {course.pass_threshold}
              </li>
            );
          })}
        </ul>
            </Fragment>
        )
    }
}

export default StudentCourses
