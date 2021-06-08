import React, { Component } from 'react'
import { Nav,Navbar,NavItem,NavbarToggler, Collapse, NavbarBrand } from 'reactstrap';
import Button from './Button'

export class Sidebar extends Component {
  constructor(props){
    super(props);

    this.state = {
      isOpen: false,
    }
  }

  toggle = () => {
    this.setState((state) => {
      return ({isOpen: !state.isOpen});
    })
  }


  deleteLocalItems() {
    if (localStorage.getItem('taskUrl')){
      localStorage.removeItem('taskUrl');
    }
    if (localStorage.getItem("taskIsExtra")) {
      localStorage.removeItem("taskIsExtra");
    }
    if (localStorage.getItem("taskAggregation")) {
      localStorage.removeItem("taskAggregation");
    }
  }

  chooseView(){
    if(localStorage.getItem('isStudent')=='true'){
      return(
        <div className=" mb-4 mb-lg-0">
          <Navbar dark expand="md">
          <NavbarBrand></NavbarBrand>
          <NavbarToggler className="mr-1" onClick={() => this.toggle()} />
          <Collapse isOpen={this.state.isOpen} navbar className="task-sidebar">
          <Nav className="pt-4 pb-4 text-center flex-md-column flex-sm-line justify-content-center">
            <NavItem className="m-md-3 m-1 text-center">
              <Button path="/student/course/tasks" className="w-80" text="Course tasks"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 text-center">
              <Button path="/student/course/details" className="w-80" text="Course details"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 text-center">
              <Button path="/student/course/progress" className="w-80" text="My progress"/>
            </NavItem>
          </Nav>
          </Collapse>
        </Navbar>
        </div>
        
      )
    }
    else{
      return(
        <div className="task-sidebar mb-5 mb-lg-0">
          <Nav className="pt-4 pb-4 text-center flex-md-column flex-sm-line justify-content-center">
            <NavItem className="m-md-3 m-1 w-80 text-center">
              <Button path="/teacher/course/tasks" className="w-80" text="Course tasks"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 w-80 text-center">
              <Button path="/teacher/course/details" className="w-80" text="Course details"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 w-80">
              <Button path="/teacher/course/students" className="w-80"  text="Enrolled students"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 w-80">
              <Button path="/teacher/course/groups" className="w-80"  text="Groups"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 w-80 text-center">
              <Button path="/teacher/task/add" onClick={this.deleteLocalItems} className="w-80"  text="Add task"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 w-80 text-center">
              <Button path="/teacher/course/leaderboard" className="w-80"  text="Leaderboard"/>
            </NavItem>
            <NavItem className="m-md-3 m-1 w-80 text-center">
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