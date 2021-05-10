import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import AddAchievementForm from '../layout/AddAchievementForm'
import Header from '../layout/Header';

export class AddAchievement extends Component {
    constructor(props){
        super(props)

        this.state = {
            name : '',
            rule: '',
            x: 0,
            y: 0,
            z: 0
       }

        this.handleName = this.handleName.bind(this);
        this.handleRule = this.handleRule.bind(this);
        this.handleX = this.handleX.bind(this);
        this.handleY = this.handleY.bind(this);
        this.handleZ = this.handleZ.bind(this);
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

	handleRule = event => {
        this.setState({
            rule : event.target.value
        })
	}

	handleX = event => {
        this.setState({
            x : event.target.value
        })
	}

	handleY = event => {
        this.setState({
            y : event.target.value
        })
	}

	handleZ = event => {
        this.setState({
            z : event.target.value
        })
	}

	handleSubmit = (e) =>{
       // e.preventDefault();
       //  fetch('/api/tasks/', {
       //      method : 'POST',
       //      headers : {
       //          Authorization : `Token ${localStorage.getItem('token')}`,
       //          'Content-Type' : 'application/json',
       //      },
       //      body : JSON.stringify(this.prepareData())
       //  })
       //  .then(res => res.json())
       //  .then(resp =>{
       //      if(resp.name == this.state.name) {
       //          alert(`Achievement ${this.state.name} added successfully.\n`
       //              + `rule: "${this.state.rule}\n", where:`
       //              + `x = ${this.state.x}\n`
       //              + `y = ${this.state.y}\n`
       //              + `z = ${this.state.z}\n`
       //          );
       //      }
       //  })
       //  .catch(err => console.log(err));
    }

    // extractID(url) {
    //     let idString = "";
    //     let slashes = 0;
    //     for (let i=0; i<url.length; i++) {
    //         if (url[i] === '/')
    //             slashes++;
    //         if (slashes === 5 && url[i] !== '/')
    //             idString += url[i];
    //     }
    //     return parseInt(idString);
    // }
    //
    // prepareData() {
    //     const courseUrl = localStorage.getItem('courseUrl');
    //     const course = this.extractID(courseUrl)
    //     console.log("beforetask")
    //     if (localStorage.getItem('taskUrl') == null) {
    //         console.log("task")
    //         return {
    //             name: this.state.name,
    //             grade_min: this.state.gradeMin,
    //             grade_max: this.state.gradeMax,
    //             is_extra: false,
    //             weight: this.state.weight,
    //             deadline: this.state.deadline,
    //             aggregation_method: "AVG",
    //             course: course
    //         }
    //     } else {
    //         const taskUrl = localStorage.getItem('taskUrl');
    //         const parent_task = this.extractID(taskUrl);
    //         return {
    //             name: this.state.name,
    //             grade_min: this.state.gradeMin,
    //             grade_max: this.state.gradeMax,
    //             is_extra: false,
    //             weight: this.state.weight,
    //             deadline: this.state.deadline,
    //             aggregation_method: "AVG",
    //             course: course,
    //             parent_task: parent_task
    //         }
    //     }
    // }

    render() {
        const { name , rule, x, y, z} = this.state;
        return (
            <Fragment>
                <Header button1_text="Achievements" button2_text="Log Out" button1_path="/teacher/course/achievements" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Row xs={3} className="mt-4 mb-5 ml-3">
                        <Col xs={5} className="heading text-center login_heading">Create achievement</Col>
                    </Row>
                    <Row className="mt-2">
                        <Col xs={1}></Col>
                        <Col xs={10} className="text-center">
                        <AddAchievementForm
                            buttonText = "Create"
                            handleName = {this.handleName}
                            handleRule = {this.handleRule}
                            handleX = {this.handleX}
                            handleY = {this.handleY}
                            handleZ = {this.handleZ}
                            handleSubmit = {this.handleSubmit}
                            name = {name}
                            rule = {rule}
                            x = {x}
                            y = {y}
                            z = {z}
                            readOnly = {false}
                        />
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}

export default AddAchievement
