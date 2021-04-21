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
             name: localStorage.getItem('courseName'),
			 tasks: [],
             loaded: false,
		}
	}

    componentDidMount(){
        if(localStorage.getItem('token')){
            this.getTasks();
        }   
        else{
            alert("Log in to see the view");
            window.location.href="/";
        }
            
    }

    getCourseDatails(){
        fetch(localStorage.getItem('url'), {
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

    prepareView(){
        // if(this.state.loaded==false){
        //     return (<Col xs={12} className="mb-5 mt-5"><Spinner/></Col>);
        // }
        // else{
        //     return (  
        //         <Row className="p-2">
        //             {this.state.tasks.map(task=> {
        //             return (
        //                 <Col xs={12} key={task.name+task.deadline+task.url} className="mb-4">
        //                     <TaskIcon
        //                     task_name = {task.name}
        //                     deadline = {task.deadline}
        //                     task_details_path = {task.url}
        //                     max_points = "/50"
        //                     />
        //                 </Col>
        //             )})}
        //         </Row>
        //     )
        // }
    }


    render() { 
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true}/>
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={2}></Col>  
                        <Col xs={6} className="title text-left">{this.state.name}</Col>                             
                    </Row>
                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
                            <Sidebar/>
                        </Col>
                        <Col xs={10}>
                         {this.prepareView()}  
                        </Col>
                    </Row>
                </Container> 
                <Footer/>                  
            </Fragment>
        )
    }
}

export default Tasks
