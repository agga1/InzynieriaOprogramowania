import React, { Component } from 'react'
import { Nav,NavItem } from 'reactstrap';
import Button from './Button'
import AddStudentsModal from './AddStudentsModal';


export class Sidebar extends Component { 
    constructor(props) {
		super(props)

        this.state = {
             chosenStudents: [],
             show: false,
             isStudent: localStorage.getItem('isStudent'),
		}
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
        .then( () =>{
            if(this.props.refresh!=undefined){
                this.props.refresh();
            };
            this.handleCancel();
        }
        )
        .catch(err => console.log(err));
    }

    handleCancel = () => {
        this.setState((state) => ({
            chosenStudents: [],
            show: !state.show
        }))
    }

    handleStudents = (e) => {
        this.setState({chosenStudents: e});
    }

    prepareData(){
        console.log(this.props.refresh);
        var students_id = this.state.chosenStudents;
        students_id = students_id.map(e => e.value);
        return{
            students: students_id,
        }
    }

    deleteParentTask() {
        if (localStorage.getItem('taskUrl')){
            localStorage.removeItem('taskUrl');
        }
    }

    chooseView(){
        var isStudent = this.state.isStudent;
        if(isStudent=='true'){
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
                    <AddStudentsModal 
                        show={this.state.show}
                        chosenStudents = {this.state.chosenStudents}
                        handleStudents = {this.handleStudents}
                        handleSubmit = {this.handleSubmit}
                        handleCancel = {this.handleCancel}
                    />
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
                            <Button onClick={this.showModal} className="w-80"  text="Add student"/>
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