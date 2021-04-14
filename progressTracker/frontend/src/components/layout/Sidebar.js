import React, { Component } from 'react'
import { Nav,NavItem } from 'reactstrap';
import Button from './Button'

export class Sidebar extends Component { 
    render() {
        return (
            <div className="task-sidebar">
               <Nav vertical className="pt-4 pb-4 text-center">
                    <NavItem className="m-3 text-center">
                       <Button path="/student/course/tasks" text="Course tasks"/>
                   </NavItem>
                   <NavItem className="m-3">
                       <Button path="/student/course/students" text="Enrolled students"/>
                   </NavItem>
                   <NavItem className="m-3 text-center">
                       <Button path="/student/course/details" text="Course details"/>
                   </NavItem>
                   <NavItem className="m-3 text-center">
                       <Button path="/teacher/course/addstudent" text="Add student"/>
                   </NavItem>
               </Nav>
            </div>
        )
    }
}

export default Sidebar