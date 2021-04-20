import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import TaskIcon from '../layout/TaskIcon';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import Footer from '../layout/Footer';

export class Tasks extends Component {
    constructor(props) {
		super(props)

        this.state = {
             name: '',
			 tasks: [],
             loaded: false,
		}
        this.handleLogout = this.handleLogout.bind(this);
	}

    componentDidMount(){
        if(localStorage.getItem('token')){
            this.getCourseName();
            this.getTasks();
        }   
        else{
            alert("Log in to see the view");
            window.location.href="/";
        }
            
    }

    getCourseName(){
        fetch(localStorage.getItem('courseUrl'), {
            method : 'GET',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.status > 400) {
                return this.setState(() => {
                return { placeholder: "Something went wrong!" };
            });}
            return response.json();
        })
        .then(json => {
            this.setState(() => {
            return {
                name: json.name
            };});
        });
    }

    getTasks(){
        fetch(localStorage.getItem('courseUrl')+'tasks', {
            method : 'GET',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.status > 400) {
                return this.setState(() => {
                return { placeholder: "Something went wrong!" };
            });}
            return response.json();
        })
        .then(data => {
            this.setState(() => {
            return {
                tasks: data.tasks,
                loaded: true
            };});
        });
       
    }

    handleLogout = () => {
        fetch('/api/auth/logout', {
			crossDomain : true,
			withCredentials : true,
			async : true,
			method : 'POST',
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			},
		})
		.catch(error => {
			console.log(error)
		})
		localStorage.removeItem('token');
	}


    prepareView(){
        if(this.state.loaded==false){
            return (<Col xs={12} className="mb-4"><Spinner/></Col>);
        }
        else{
            return (  
                <Row>
                    <Col xs={2} className="ml-0 pl-0">
                        <Sidebar/>
                    </Col>
                    <Col xs={10}>
                        <Row className="p-2">
                        {this.state.tasks.map(task=> {
                        return (
                            <Col xs={12} key={task.name+task.deadline} className="mb-4">
                                <TaskIcon
                                task_name = {task.name}
                                deadline = {task.deadline}
                                task_details_path = {task.url}
                                />
                            </Col>
                        )})}
                        </Row>
                    </Col>
                </Row>
            )
        }
    }

    render() { 
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" button2_handle={this.handleLogout}/>
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={2}></Col>  
                        <Col xs={6} className="heading login_heading text-left">{this.state.name}</Col>                             
                    </Row>
                    {this.prepareView()}  
                </Container> 
                <Footer/>                  
            </Fragment>
        )
    }
}

export default Tasks
