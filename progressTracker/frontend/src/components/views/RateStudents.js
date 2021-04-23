import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Table } from  'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import AddStudents from '../layout/AddStudents';

export class RateStudents extends Component {
    constructor(props) {
		super(props)

        this.state = {
             name: localStorage.getItem('taskName'),
			 students: [],
             count: 0,
             show: false,
             loaded: false,
		}
	}

    componentDidMount(){
        if(localStorage.getItem('token')){
            if(localStorage.getItem('isStudent')=='false'){
                fetch(localStorage.getItem('courseUrl')+'students', {
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
                        students: data.students,
                        loaded: true
                    };});
                });
            }
            else{
                alert('Only teacher can rate students!!!');
            }
        }      
        else{
            alert('Log into to see the view');
            window.location.href="/";
        }
    }

    getStudentsGrade(student){

    }

    
    updateCount= () => {
        // this.setState((state) => ({count:state.count+1}));
        return this.state.count;
    };

    showModal = () => {
        this.setState((state) => ({
            show: !state.show
        }));
    }

    handleCancel = () => {
        this.setState((state) => ({
            show: !state.show
        }))
    }

    handleSubmit = () => {
       
    }

    prepareView() {
        if (this.state.loaded == false) {
          return (
            <Col xs={12} className="mb-5 mt-5">
              <Spinner />
            </Col>
          );
        } else {
          return (
            <Col xs={10} className="pr-4">
                <Table striped className="students-list">
                    <thead>
                        <tr>
                        <th className="td-sm">no.</th>
                        <th colSpan="3">Name</th>
                        <th className="td-sm">Points</th>
                        <th className="td-sm">Rate</th>
                        <th className="td-sm">Orderxd</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map(student=> {
                            return (
                                <tr key={student.user.id}>
                                <td className="td-sm" scope="row">{this.state.students.indexOf(student)}</td>
                                <td colSpan="3">{student.user.first_name} {student.user.last_name}</td>
                                <td className="td-sm">{this.getStudentsGrade()}</td>
                                <td className="td-sm"><a className='btn btn-sm' role="button" aria-pressed="true" onClick={this.showModal}>Rate</a></td>
                                <td className="td-sm"><a className='btn btn-sm' role="button" aria-pressed="true" onClick={this.props.onClick}>b</a></td>
                            </tr>  
                            );
                        })} 
                    </tbody>
                </Table>
        </Col>
          );
        }
      }

    render() {
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true}/>
                <Container fluid>
                <AddStudents 
                        show={this.state.show}
                        // chosen_students = {this.state.chosen_students}
                        // handleStudents = {this.handleStudents}
                        handleSubmit = {this.handleSubmit}
                        handleCancel = {this.handleCancel}
                    />
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={3}></Col>  
                        <Col xs={6} className="heading login_heading text-left">{this.state.name}</Col>                             
                    </Row>

                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
                            <Sidebar/>
                        </Col>
                        {this.prepareView()}                        
                    </Row>
                    
                </Container>    
                <Footer/>               
            </Fragment>
        )
    }
}

export default RateStudents
