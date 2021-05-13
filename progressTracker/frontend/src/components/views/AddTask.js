import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import AddTaskForm from '../layout/forms/AddTaskForm'
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { checkUser } from '../functions/helpers';

export class AddTask extends Component {
    constructor(props){
        super(props)

        this.state = {
            name : '',
            description: '',
            gradeMin: 0,
            gradeMax: 0,
            weight: 0,
            isExtra: false,
            deadline: '2021-04-20T23:22:00Z',
            aggregation: {label:"sum", value:"SUM"},
            aggregationOptions:[
                {value:"AVG", label: "average"},
                {label:"weighted average", value:"WAVG"},
                {label:"sum", value:"SUM"},
            ]
       }

        this.handleName = this.handleName.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleGradeMin = this.handleGradeMin.bind(this);
        this.handleGradeMax = this.handleGradeMax.bind(this);
        this.handleWeight = this.handleWeight.bind(this);
        this.handleDeadline = this.handleDeadline.bind(this);
        this.handleExtra = this.handleExtra.bind(this);
        this.handleAggregation = this.handleAggregation.bind(this);
    }

    componentDidMount(){
        checkUser("/student/courses");
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

    handleExtra = () => {
        this.setState( (state) => {
            return {
                isExtra: !state.isExtra,        
            }   
        })
	}

    handleAggregation = () => {
        this.setState( (state) => {
            return {
                isExtra: !state.isExtra,        
            }   
        })
	}

	handleDeadline = event => {
        this.setState({
            deadline : event.target.value
        })
	}

    handleAggregation = (event) => {
        this.setState({
            aggregation: event,    
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
                    + `aggregation method: ${this.state.aggregation}\n`
                    + `is extra: ${this.state.isExtra}\n`
                    + `deadline: ${this.state.deadline}\n`
                );
                window.location.href="/teacher/course/tasks";
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

        return {
            name: this.state.name,
            grade_min: parseInt(this.state.gradeMin),
            grade_max: parseInt(this.state.gradeMax),
            is_extra: this.state.isExtra,
            weight: parseInt(this.state.weight),
            deadline: this.state.deadline,
            description: this.state.description,
            aggregation_method: this.state.aggregation.value,
            course: this.extractID(courseUrl),
            parent_task: (localStorage.getItem('taskUrl') == null ? null : this.extractID(localStorage.getItem('taskUrl')))  
        }


    }

    render() {
        const { name , description, gradeMin, gradeMax, weight, isExtra, aggregation, deadline} = this.state;
        return (
            <Fragment>
                <Header button1_text="My Tasks" button2_text="Log Out" button1_path="/teacher/course/tasks" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Row xs={3} className="mt-4 mb-5 ml-3">
                        <Col xs={3} className="heading text-center login_heading">Add task</Col>

                    </Row>
                    <Row className="mt-2">
                        <Col xs={1}></Col>
                        <Col xs={10} className="text-center">
                        <AddTaskForm
                            buttonText = "Create"
                            handleName = {this.handleName}
                            handleDescription = {this.handleDescription}
                            handleGradeMin = {this.handleGradeMin}
                            handleGradeMax = {this.handleGradeMax}
                            handleWeight = {this.handleWeight}
                            handleDeadline = {this.handleDeadline}
                            handleSubmit = {this.handleSubmit}
                            handleExtra = {this.handleExtra}
                            handleAggregation = {this.handleAggregation}
                            name = {name}
                            description = {description}
                            gradeMin = {gradeMin}
                            gradeMax = {gradeMax}
                            weight = {weight}
                            isExtra = {isExtra}
                            deadline = {deadline}
                            readOnly = {false}
                            aggregation = {aggregation}
                            aggregationOptions = {this.state.aggregationOptions}
                        />
                        </Col>
                    </Row>
                    <Row className="mb-5 mt-5" />
                </Container>
                <Footer/>   
            </Fragment>
        )
    }
}

export default AddTask
