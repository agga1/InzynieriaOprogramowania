import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import AddTaskForm from '../layout/AddTaskForm'
import Header from '../layout/Header';

export class AddTask extends Component {
    constructor(props){
        super(props)

        this.state = {
            name : '',
            description: '',
            gradeMin: 0,
            gradeMax: 0,
            weight: 0,
            deadline: ''
       }

        this.handleName = this.handleName.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleGradeMin = this.handleGradeMin.bind(this);
        this.handleGradeMax = this.handleGradeMax.bind(this);
        this.handleWeight = this.handleWeight.bind(this);
        this.handleDeadline = this.handleDeadline.bind(this);
    }

    componentDidMount(){
        if(localStorage.getItem('token')){
            fetch('/api/auth/user', {
                method : 'GET',
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(resp => {
             if(resp.user.is_student != false){
                 alert("Only teacher can add tasks");
                 window.location.href="/student/courses";
             }
            })
            .catch(err => console.log(err));

        }
        else{
            alert('Log into to see the view');
            window.location.href="/";
        }
    }

    handleName = event => {
        this.setState({
            name : event.target.value
        })
	}

	handleDescription = event => {
        this.setState({
            description : event.target.value
        })
	}

	handleGradeMin = event => {
        this.setState({
            gradeMin : event.target.value
        })
	}

	handleGradeMax = event => {
        this.setState({
            gradeMax : event.target.value
        })
	}

	handleWeight = event => {
        this.setState({
            weight : event.target.value
        })
	}

	handleDeadline = event => {
        this.setState({
            deadline : event.target.value
        })
	}

	handleSubmit = (e) =>{
       e.preventDefault();
        fetch('/api/tasks/', {
            method : 'POST',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(this.prepareData())
        })
        .then(res => res.json())
        .then(resp =>{
            if(resp.name == this.state.name) {
                alert(`Task ${this.state.name} added successfully.\n`
                    + `grade min: ${this.state.gradeMin}\n`
                    + `grade max: ${this.state.gradeMax}\n`
                    + `weight: ${this.state.weight}\n`
                    + `deadline: ${this.state.deadline}\n`
                );
            }
        })
        .catch(err => console.log(err));
    }

    extractID(url) {
        let idString = "";
        let slashes = 0;
        for (let i=0; i<url.length; i++) {
            if (url[i] === '/')
                slashes++;
            if (slashes === 5 && url[i] !== '/')
                idString += url[i];
        }
        return parseInt(idString);
    }

    prepareData() {
        const courseUrl = localStorage.getItem('courseUrl');
        const course = this.extractID(courseUrl)
        console.log("beforetask")
        if (localStorage.getItem('taskUrl') == null) {
            console.log("task")
            return {
                name: this.state.name,
                grade_min: this.state.gradeMin,
                grade_max: this.state.gradeMax,
                is_extra: false,
                weight: this.state.weight,
                deadline: this.state.deadline,
                aggregation_method: "AVG",
                course: course
            }
        } else {
            const taskUrl = localStorage.getItem('taskUrl');
            const parent_task = this.extractID(taskUrl);
            return {
                name: this.state.name,
                grade_min: this.state.gradeMin,
                grade_max: this.state.gradeMax,
                is_extra: false,
                weight: this.state.weight,
                deadline: this.state.deadline,
                aggregation_method: "AVG",
                course: course,
                parent_task: parent_task
            }
        }
    }

    render() {
        const { name , description, gradeMin, gradeMax, weight, deadline} = this.state;
        return (
            <Fragment>
                <Header button1_text="My Tasks" button2_text="Log Out" button1_path="/student/course/tasks" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Row xs={3} className="mt-4 mb-5 ml-3">
                        <Col xs={3} className="heading text-center login_heading">Add task</Col>

                    </Row>
                    <Row className="mt-2">
                        <Col xs={1}></Col>
                        <Col xs={10} className="text-center">
                        <AddTaskForm
                            handleName = {this.handleName}
                            handleDescription = {this.handleDescription}
                            handleGradeMin = {this.handleGradeMin}
                            handleGradeMax = {this.handleGradeMax}
                            handleWeight = {this.handleWeight}
                            handleDeadline = {this.handleDeadline}
                            handleSubmit = {this.handleSubmit}
                            name = {name}
                            description = {description}
                            gradeMin = {gradeMin}
                            gradeMax = {gradeMax}
                            weight = {weight}
                            deadline = {deadline}
                        />
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}

export default AddTask
