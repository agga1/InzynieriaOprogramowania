import React, { Component, Fragment } from 'react'
import Header from '../layout/Header'
import StudentLoginPage from './StudentLoginPage'
import TeacherLoginPage from './TeacherLoginPage'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Courses from './Courses'
import Tasks from './Tasks'
import StudentsList from './StudentsList'
import Groups from './Groups'
import AddGroup from './AddGroup'
import AddCourse from './AddCourse'
import AddTask from './AddTask'
import Grades from './Grades'
import TaskDetails from './TaskDetails'
import UpdateTask from './UpdateTask'
import Leaderboard from './Leaderboard'
import Achievements from './Achievements'
import AddAchievement from './AddAchievement'
import Progress from './Progress'
import Footer from '../layout/Footer'
import CourseDetails from "./CourseDetails";
import UpdateCourse from "./UpdateCourse";
import {NotEarnedAchievements} from "./NotEarnedAchievements";
import Histogram from './Histogram'


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
          <Route path='/teacher/course/groups' component={Groups}/>
          <Route path='/teacher/group/add' component={AddGroup}/>
          <Route path='/teacher/course/add' component={AddCourse}/>
          <Route path='/teacher/task/add' component={AddTask}/>
          <Route path='/teacher/task/grades' component={Grades}/>
          <Route path='/teacher/task/details' component={TaskDetails}/>
          <Route path='/student/task/details' component={TaskDetails}/>
          <Route path='/teacher/task/update' component={UpdateTask}/>
          <Route path='/teacher/course/leaderboard' component={Leaderboard}/>
          <Route path='/teacher/course/achievements' component={Achievements}/>
          <Route path='/teacher/achievement/add' component={AddAchievement}/>
          <Route path='/student/course/progress' component={Progress}/>
          <Route path='/student/course/not-earned-achievements' component={NotEarnedAchievements}/>
          <Route path='/teacher/course/details' component={CourseDetails}/>
          <Route path='/student/course/details' component={CourseDetails}/>
          <Route path='/teacher/course/update' component={UpdateCourse}/>
          <Route path='/teacher/task/histogram' component={Histogram}/>
          <Route path='/student/task/histogram' component={Histogram}/>
        </Switch>
      </Router>

    )
  }
}

export default HomePage
