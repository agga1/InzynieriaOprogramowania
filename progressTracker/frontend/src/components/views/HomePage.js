import React, { Component, Fragment, useState } from 'react'
import Header from '../layout/Header'
import StudentLoginPage from './StudentLoginPage'
import TeacherLoginPage from './TeacherLoginPage'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import StudentCourses from './StudentCourses'
import Tasks from './Tasks'
import StudentsList from './StudentsList'
import AddCourse from './AddCourse'
import AddTask from './AddTask'
import RateStudents from './RateStudents'
import Footer from '../layout/Footer'


export class HomePage extends Component {
    constructor(props){
        super(props);
    }
    render() {
        
        return (
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <Fragment>
                            <Header button1_text="Student" button2_text="Teacher" button1_path="/student_login" button2_path="teacher_login"/>
                            <h1 className="d-flex justify-content-center heading" id="main_heading">TeachRideExperience</h1>
                            <img src="../../static/images/sleeping_students.png" className="mx-auto d-block" alt="sleeping students furing lecture" />
                            <Footer/>
                        </Fragment>
                    </Route>
                    <Route path='/student_login' component={StudentLoginPage}/>
                    <Route path='/teacher_login' component={TeacherLoginPage}/>
                    <Route path='/student/courses' component={StudentCourses}/>
                    <Route path='/student/course/tasks' component={Tasks}/>
                    <Route path='/student/course/students' component={StudentsList}/>
                    <Route path='/teacher/course/add' component={AddCourse}/>
                    <Route path='/teacher/task/add' component={AddTask}/>
                    <Route path='/teacher/task/rate' component={RateStudents}/>
                </Switch>
            </Router>
           
        )
    }
}

export default HomePage
