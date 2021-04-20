import React, { Component } from 'react'
import { Nav,NavItem } from 'reactstrap';
import Button from './Button'
import AddStudents from './AddStudents';


export class Sidebar extends Component { 
    constructor(props) {
		super(props)

        this.state = {
             chosen_students: [],
             show: false,
             isStudent: localStorage.getItem('isStudent'),
		}
        this.showModal = this.showModal.bind(this);
        this.handleStudents = this.handleStudents.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
	}

    showModal = () => {
        this.setState((state) => ({
            show: !state.show
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch(localStorage.getItem('courseUrl')+'add_students/', {
            method : 'POST',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(this.prepareData())
        })
        .then(res => res.json())
        .then(
            this.handleCancel()
        )
        .catch(err => console.log(err));
    }

    handleCancel = () => {
        this.setState((state) => ({
            chosen_students: [],
            show: !state.show
        }))
    }

    handleStudents = (e) => {
        this.setState({chosen_students: e});
    }


    prepareData(){
        var students_id = this.state.chosen_students;
        students_id = students_id.map(e => e.value);
        return{
            students: students_id,
        }
    }


    chooseView(){
        var isStudent = this.state.isStudent;
        if(isStudent=='true'){
            return(
                <div className="task-sidebar">
                    <Nav vertical className="pt-4 pb-4 text-center">
                        <NavItem className="m-3 text-center">
                        <Button path="/student/course/tasks" text="Course tasks"/>
                    </NavItem>
                    <NavItem className="m-3 text-center">
                        <Button path="/student/course/details" text="Course details"/>
                    </NavItem>
                </Nav>`
               </div>
            ) 
        }
        else{
            return(
                <div className="task-sidebar">
                    <AddStudents 
                        show={this.state.show}
                        text = "Add students"
                        chosen_students = {this.state.chosen_students}
                        handleStudents = {this.handleStudents}
                        handleSubmit = {this.handleSubmit}
                        handleCancel = {this.handleCancel}
                    />
                    <Nav vertical className="pt-4 pb-4 text-center">
                        <NavItem className="m-3 text-center">
                        <Button path="/student/course/tasks" text="Course tasks"/>
                    </NavItem>
                    <NavItem className="m-3 text-center">
                        <Button path="/student/course/details" text="Course details"/>
                    </NavItem>
                    <NavItem className="m-3">
                        <Button path="/student/course/students" text="Enrolled students"/>
                    </NavItem>
                    <NavItem className="m-3 text-center">
                        <Button onClick={this.showModal} text="Add student"/>
                    </NavItem>
                    <NavItem className="m-3 text-center">
                        <Button path="/teacher/task/add" text="Add task"/>
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