import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Table } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import {getStudents} from '../functions/helpers'
import CustomModal from '../layout/modals/CustomModal';
import { Container as FABContainer, Button as FABBtn } from 'react-floating-action-button'
import AddStudentsModal from '../layout/modals/AddStudentsModal';
import AddStudentsComponent from '../layout/AddStudentComponent';

export class StudentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: localStorage.getItem("courseName"),
      students: [],
      showDeleteModal: false,
      studentToDelete: -1,
      showAdd: false,
      loaded: false,
    };
    this.showAddModal = this.showAddModal.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      getStudents()
        .then((data) => {
          this.setState(() => ({
            students: data,
            loaded: true,
          }));
        })
        .catch((err) => alert(err.message));
    }
  }

  showDeleteModal = (student) => {
    this.setState((state) => ({
      showModal: !state.showModal,
      studentToDelete: student
    }));
  };

  handleDeleteSubmit = (e) => {
    e.preventDefault();
    fetch(localStorage.getItem('courseUrl')+'del_students/', {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"students":[this.state.studentToDelete]})
    })
      .then((res) => {
        if (res.status < 300) {
          this.refresh();
        } else {
          alert("Error occured. Error number: " + res.status);
        }
        this.handleDeleteCancel();
      })
      .catch((err) => console.log(err));
  };

  handleDeleteCancel = () => {
    this.setState((state) => ({
      showModal: !state.showModal,
      studentToDelete: -1,
    }));
  };

  refresh() {
    window.location.reload();
  }

  showAddModal = () => {
    this.setState((state) => ({
      showAdd: !state.showAdd
    }));
  }

  prepareButtons(){
    if (localStorage.getItem("isStudent") == "false"){
      return (
        <FABContainer>
          <FABBtn
            tooltip="Add student"
            className="orange-bg"
            icon="fas fa-plus fa-2x "
            onClick={() => this.showAddModal()}
          />
        </FABContainer>
      )
    }
  }


  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={10} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      this.state.refresh == true ? this.refresh() : null;
      return (
        <Col xs={10}>
          <Table striped className="students-list">
            <thead>
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Index_nr</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.students.map((student) => {
                return (
                  <tr key={this.state.students.indexOf(student)}>
                    <th scope="row">{this.state.students.indexOf(student)}</th>
                    <td>{student.user.first_name}</td>
                    <td>{student.user.last_name}</td>
                    <td>{student.user.email}</td>
                    <td>{student.index_nr}</td>
                    <td>
                      <a
                        className="btn fas fa-trash fa-lg"
                        role="button"
                        aria-pressed="false"
                        onClick={() => this.showDeleteModal(student.user.id)}
                        style={{"margin":0}}
                      />
                    </td>
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
    const {showAdd} = this.state
    return (
      <Fragment>
        <Header
          button1_text="My Courses"
          button2_text="Log Out"
          button1_path="/student/courses"
          button2_path="/"
          is_logout={true}
        />
        <CustomModal 
          show={this.state.showDeleteModal}
          title="Warning"
          body="Are you sure you want to delete this student?"
          handleSubmit={this.handleDeleteSubmit}
          handleCancel={this.handleDeleteCancel}
        />
        <AddStudentsComponent showAdd={showAdd} toggleAdd={this.showAddModal} refresh={this.refresh} />
        <Container fluid>
          <Row className="mt-4 mb-5 ml-3">
            <Col xs={2}></Col>
            <Col xs={9} className="heading title text-left">
              {this.state.name}
            </Col>
          </Row>

          <Row>
            <Col xs={2} className="ml-0 pl-0">
              <Sidebar refresh={this.refresh} />
            </Col>
            {this.prepareView()}
          </Row>
        </Container>
        {this.prepareButtons()}
        <Footer />
      </Fragment>
    );
  }
}

export default StudentsList;
