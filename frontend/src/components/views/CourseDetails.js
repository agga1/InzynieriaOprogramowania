import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import { deleteElement, getElement } from '../functions/helpers';
import CustomModal from '../layout/modals/CustomModal';
import { Container as FABContainer, Link as FABLink, Button as FABBtn } from 'react-floating-action-button'
import toast from 'react-hot-toast';

export class CourseDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: localStorage.getItem("courseName"),
      description: '',
      pass_threshold: '',
      teacher: { title: '', user: {}},
      students_number: 0,
      tasks_number: 0,
      showModal: false,
      loaded: false,
    }
  }

  getCourseDetails() {
    getElement(localStorage.getItem("courseUrl"))
      .then((data) => {
        this.setState(() => {
          return {
            description: data.description,
            pass_threshold: data.pass_threshold,
            teacher: data.teacher,
            loaded: true,
          };
        });
      });
  }

  getStudentsNumber(){
    getElement(localStorage.getItem("courseUrl") + "students")
      .then((data) => {
        this.setState(() => {
          return {
            students_number: data.students.length,
          };
        });
      });
  }

  getMainTasksNumber(){
    getElement(localStorage.getItem("courseUrl") + "main_tasks")
      .then((data) => {
        this.setState(() => {
          return {
            tasks_number: data.tasks.length,
          };
        });
      });
  }

  presentTeacher(){
    return this.state.teacher.title + " " + this.state.teacher.user.first_name + " " + this.state.teacher.user.last_name;
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.getCourseDetails();
      this.getStudentsNumber();
      this.getMainTasksNumber();
    }
    else {
      toast.error('Log into to see the view',{duration:6000});
      window.location.href = "/";
    }
  }

  toggleModal = () => {
    this.setState((state) => ({
      showModal: !state.showModal
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    deleteElement(localStorage.getItem('courseUrl'))
      .then(() => {this.toggleModal();window.location.href="/teacher/courses"});
  }

  handleCancel = () => {
    this.toggleModal();
  }

  getCSV = () => {
    fetch(localStorage.getItem("courseUrl") + "grades_csv", {
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      }
    })
    .then(response => response.blob())
    .then(blob => {
          let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'grades.csv';
					a.click();
    })
    .catch(err => {
      console.log(err);
      toast.error("Error occured while downloading file.");
    })
  }

  prepareButtons(){
    if (localStorage.getItem("isStudent") == "false"){
      return (
        <FABContainer>
          <FABBtn
            tooltip="Export to csv"
            className="orange-bg"
            icon="fas fa-file-download fa-lg "
            onClick={() => this.getCSV()}
          />
          <FABLink
            tooltip="Edit description"
            className="orange-bg"
            icon="fas fa-align-center fa-lg"
            href="/teacher/course/update"
          />
          <FABBtn
            tooltip="Delete course"
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
    if (this.state.loaded === false) {
      return (
        <Col ms={10} className="mb-5 mt-5">
          <Spinner className="spinner-no-style"/>
        </Col>
      );
    } else {
      return (
        <Col ms={10} className="pr-4">
          <Row className="pr-5 pl-5 mb-4">
            <Col xs={7}>
              <Row className="ml-1 mb-3">
                <h3 className="task-heading font-weight-bold">Description:</h3>
              </Row>
              <Row  className="ml-1 mb-3">
                <h5>{this.state.description}</h5>
              </Row>
              <Row className="ml-1 mb-3">
                <h3 className="task-heading font-weight-bold">Teacher:</h3>
              </Row>
              <Row  className="ml-1">
                <h5>{this.presentTeacher()}</h5>
              </Row>
              <Row  className="ml-1 mb-3">
                <h6>{this.state.teacher.user.email}</h6>
              </Row>
              <Row className="mb-3">
                <Col md={12} className="display-flex">
                  <h3 className="task-heading font-weight-bold">Pass Threshold:</h3>
                  <h5 style={{ "paddingLeft": "40px" }}>{this.state.pass_threshold}</h5>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12} className="display-flex">
                  <h3 className="task-heading font-weight-bold">Students Number:</h3>
                  <h5 style={{ "paddingLeft": "40px" }}>{this.state.students_number}</h5>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12} className="display-flex">
                  <h3 className="task-heading font-weight-bold">Tasks Number:</h3>
                  <h5 style={{ "paddingLeft": "40px" }}>{this.state.tasks_number}</h5>
                </Col>
              </Row>
            </Col>
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
            body="Are you sure you want to delete this course?"
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
          />
          <Row className="mt-4 mb-5 ml-3">
            <Col md={2} />
            <Col md={9} className="task-heading title text-left">{this.state.name}</Col>
            <Col md={1} />
          </Row>
          <Row>
            <Col md={2} className="ml-md-0 pl-md-0">
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

export default CourseDetails
