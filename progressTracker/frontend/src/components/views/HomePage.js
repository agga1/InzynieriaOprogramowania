import React, { Component, Fragment } from 'react'
import Header from '../layout/Header'
import StudentLoginPage from './StudentLoginPage'
import TeacherLoginPage from './TeacherLoginPage'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"


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
                            <Header button1_text="Student" button2_text="Teacher"/>
                            <h1 className="d-flex justify-content-center heading" id="main_heading">TeachRideExperience</h1>
                            <img src="../../static/images/sleeping_students.png" className="mx-auto d-block" alt="sleeping students furing lecture" />
                        </Fragment>
                    </Route>
                    <Route path='/student_login' component={StudentLoginPage}/>
                    <Route path='/teacher_login' component={TeacherLoginPage}/>
                </Switch>
            </Router>
           
        )
    }
}

export default HomePage