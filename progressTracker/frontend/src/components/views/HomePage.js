import React, { Component, Fragment, useState } from 'react'
import Header from '../layout/Header'
import StudentLoginPage from './StudentLoginPage'
import TeacherLoginPage from './TeacherLoginPage'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import Courses from './Courses'
import Tasks from './Tasks'
import StudentsList from './StudentsList'
import AddCourse from './AddCourse'
import AddTask from './AddTask'
import RateStudents from './RateStudents'
import TaskDetails from './TaskDetails'
import UpdateTask from './UpdateTask'
import Leaderboard from './Leaderboard'
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
                            <Header button1_text="Student" button2_text="Teacher" button1_path="/student/login" button2_path="teacher/login"/>
                            <h1 className="d-flex justify-content-center heading" id="main_heading">TeachRideExperience</h1>
                            <img src="../../static/images/sleeping_students.png" className="mx-auto pb-5 d-block" alt="sleeping students furing lecture" />
                            <Footer/>
                        </Fragment>
                    </Route>
                    <Route path='/student/login' component={StudentLoginPage}/>
                    <Route path='/teacher/login' component={TeacherLoginPage}/>
                    <Route path='/student/courses' component={Courses}/>
                    <Route path='/teacher/courses' component={Courses}/>
                    <Route path='/student/course/tasks' component={Tasks}/>
                    <Route path='/teacher/course/tasks' component={Tasks}/>
                    <Route path='/teacher/course/students' component={StudentsList}/>
                    <Route path='/teacher/course/add' component={AddCourse}/>
                    <Route path='/teacher/task/add' component={AddTask}/>
                    <Route path='/teacher/task/rate' component={RateStudents}/>
                    <Route path='/teacher/task/details' component={TaskDetails}/>
                    <Route path='/student/task/details' component={TaskDetails}/>
                    <Route path='/teacher/task/update' component={UpdateTask}/>
                    <Route path='/teacher/course/leaderboard' component={Leaderboard}/>
                </Switch>
            </Router>
           
        )
    }
}

export default HomePage
