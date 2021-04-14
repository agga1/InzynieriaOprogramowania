import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import AddCourseForm from '../layout/AddCourseForm'
import Header from '../layout/Header';

export class AddCourse extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            name : '',
            pass_threshold : ''
       }

        this.handleName = this.handleName.bind(this);
        this.handlePassThreshold = this.handlePassThreshold.bind(this);
    }

    handleName = event => {
        this.setState({
            name : event.target.value
        })
	}

    handlePassThreshold = (e) => {
        this.setState({
            pass_threshold : e.target.value
        })
    }
   


    render() {
        const { name , pass_threshold} = this.state;
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" button2_handle={this.handleLogout}/>
                <Container fluid>
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={3}></Col> 
                        <Col xs={6} className="heading text-center login_heading">Add new course</Col>     
                                                                  
                    </Row>
                    <Row className="mt-2">
                        <Col xs={2}></Col>
                        <Col xs={8} className="text-center">
                        <AddCourseForm
                            handleName = {this.handleName}
                            handlePassThreshold = {this.handlePassThreshold}
                            name = {name}
                            pass_threshold = {pass_threshold}
                        />
                        </Col>
                    </Row> 
                </Container>                   
            </Fragment>
        )
    }
}

export default AddCourse
