import React, { Component } from 'react'
import { Nav,NavItem } from 'reactstrap';
import Button from './Button'
import AddStudentsModal from './modals/AddStudentsModal';

export class Sidebar extends Component {

  deleteParentTask() {
    if (localStorage.getItem('taskUrl')){
      localStorage.removeItem('taskUrl');
    }
  }

  chooseView(){
    if(localStorage.getItem('isStudent')=='true'){
      return(
        <div className="task-sidebar">
          <Nav vertical className="pt-4 pb-4 text-center">
            <NavItem className="m-3 text-center">
              <Button path="/student/course/tasks" className="w-80" text="Course tasks"/>
            </NavItem>
            <NavItem className="m-3 text-center">
              <Button path="/student/course/details" className="w-80" text="Course details"/>
            </NavItem>
            <NavItem className="m-3 text-center">
              <Button path="/student/course/progress" className="w-80" text="My progress"/>
            </NavItem>
          </Nav>
        </div>
      )
    }
    else{
      return(
        <div className="task-sidebar">
          <Nav vertical className="pt-4 pb-4 text-center">
            <NavItem className="m-3 w-80 text-center">
              <Button path="/teacher/course/tasks" className="w-80" text="Course tasks"/>
            </NavItem>
            <NavItem className="m-3 w-80 text-center">
              <Button path="/teacher/course/details" className="w-80" text="Course details"/>
            </NavItem>
            <NavItem className="m-3 w-80">
              <Button path="/teacher/course/students" className="w-80"  text="Enrolled students"/>
            </NavItem>
            <NavItem className="m-3 w-80">
              <Button path="/teacher/course/groups" className="w-80"  text="Groups"/>
            </NavItem>
            <NavItem className="m-3 w-80 text-center">
              <Button path="/teacher/task/add" onClick={this.deleteParentTask} className="w-80"  text="Add task"/>
            </NavItem>
            <NavItem className="m-3 w-80 text-center">
              <Button path="/teacher/course/leaderboard" className="w-80"  text="Leaderboard"/>
            </NavItem>
            <NavItem className="m-3 w-80 text-center">
              <Button path="/teacher/course/achievements" className="w-80"  text="Achievements"/>
            </NavItem>
          </Nav>
        </div>
      )

    }
  }

  render() {
    return (
      this.chooseView()
    )
  }
}

export default Sidebar