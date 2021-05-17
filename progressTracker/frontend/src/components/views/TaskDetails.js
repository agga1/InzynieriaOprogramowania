import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import { getElement } from '../functions/helpers'
import Button from '../layout/Button';
import parse from "html-react-parser";
import CustomModal from '../layout/CustomModal';
import { Container as FABContainer, Link as FABLink, Button as FABBtn} from 'react-floating-action-button'

export class TaskDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            task: { name: '', grade_max: '' },
            showModal: false,
            loaded: false,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            getElement(localStorage.getItem('taskUrl')).then((data) => {
                this.setState(() => ({
                    task: data,
                    loaded: true
                }))
            })
                .catch((err) =>
                    alert(err.message)
                )
        }
        else {
            alert('Log into to see the view');
            window.location.href = "/";
        }
    }

    getBetterAggregationName = (shortName) => {
        switch (shortName) {
            case "SUM":
                return "Sum";
            case "AVG":
                return "Average";
            case "WAVG":
                return "Weighted average";
            default:
                throw new Error(`Aggregation method name "${shortName}" does not have longer equivalent`);
        }
    }

    toggleModal = () => {
        this.setState((state) => ({
            showModal: !state.showModal
        }));
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/tasks/'+this.state.task.id, {
            method : 'DELETE',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
        })
        .then(res => {
          if(res.status<300){
            window.location.reload();
          }else{
            alert("Error occured. Error number: "+res.status);
          }
          this.toggleModal();
        })
        .catch(err => console.log(err));
    }
    
    handleCancel = () => {
        this.toggleModal();
    }

    prepareButtons(){
        if (localStorage.getItem("isStudent") == "false"){
          return (
            <FABContainer>
              <FABLink
                tooltip="Edit description"
                className="orange-bg"
                icon="fas fa-align-center fa-lg"
                href="/teacher/task/update"
                />
                <FABBtn
                tooltip="Delete task"
                className="orange-bg"
                icon="fas fa-trash fa-lg "
                onClick={() => this.toggleModal()}
                />
                <FABBtn
                tooltip="See actions"
                className="orange-bg"
                icon="fas fa-pencil-alt fa-2x"
                />
            </FABContainer>
          )
        }
      }      

    prepareView() {
        if (!this.state.loaded) {
            return (
                <Col xs={10} className="mb-5 mt-5">
                    <Spinner className="spinner"/>
                </Col>
            );
        } else {
            return (
                <Col xs={10} className="pr-4">
                    <Row className="pr-5 mb-4" style={{ "paddingLeft": "60px" }}>
                        <h4 className="task-heading font-weight-bold">Description:</h4>
                    </Row>
                    <Row className="pr-5 pl-5 ml-2 mb-4">
                        <div>
                            {parse(this.state.task.description)}
                        </div>
                    </Row>
                    <Row className="pr-5 pl-5 mb-4">
                        <Col xs={7}>
                            <Row>
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold">Deadline</h4>
                                    <h5 style={{ "paddingLeft": "62px" }}>{this.state.task.deadline}</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold pr-4">Aggregation </h4>
                                    <h5 style={{ "paddingLeft": "2px" }}>
                                        {this.getBetterAggregationName(this.state.task.aggregation_method)}
                                    </h5>
                                </Col>
                            </Row>
                            <Row >
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold" >Weight </h4>
                                    <h5 style={{ "paddingLeft": "80px" }}>{this.state.task.weight}</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="display-flex">
                                    <h4 className="task-heading font-weight-bold pr-4">Is extra </h4>
                                    <h5 style={{ "paddingLeft": "52px" }}>{this.state.task.is_extra ? "yes" : "no"}</h5>
                                </Col>
                            </Row>
                        </Col>
                        {/* {localStorage.getItem('isStudent') == 'true' ? <Col></Col> :
                            <Col xs={5} className="mt-4 pr-5 text-right">
                                <Button path="/teacher/task/update" text="Edit description" />
                            </Col>
                        } */}
                    </Row>
                    {this.prepareButtons()}
                </Col>
            );
        }
    }


    render() {
        return (
            <Fragment>
                <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true} />
                <Container fluid>
                    <CustomModal
                        show={this.state.showModal}
                        title="Warning"
                        body="Are you sure you want to delete this task?"
                        handleSubmit={this.handleSubmit}
                        handleCancel={this.handleCancel}
                    />
                    <Row className="mt-4 mb-5 ml-3">
                        <Col xs={2} />
                        <Col xs={9} className="task-heading title text-left">{this.state.task.name}</Col>
                        <Col xs={1} className="task-heading login_heading text-right pr-5" style={{ "fontSize": "40px" }}>{this.state.task.grade_max}</Col>
                    </Row>
                    <Row>
                        <Col xs={2} className="ml-0 pl-0">
                            <Sidebar />
                        </Col>
                        {this.prepareView()}
                    </Row>
                </Container>
                <Footer />
            </Fragment>
        )
    }
}

export default TaskDetails
