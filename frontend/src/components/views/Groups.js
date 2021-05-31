import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import TaskIcon from "../layout/icons/TaskIcon";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Spinner from "../layout/Spinner";
import Footer from "../layout/Footer";
import {checkUser, getElement} from "../functions/helpers";
import Button from '../layout/Button';
import { Spinner as MiniSpinner } from "reactstrap";


export class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: localStorage.getItem("courseName"),
      groups: [],
      loaded: true, // TODO set false
    };
  }

  componentDidMount() {
    checkUser("/student/courses");

    // this.getGroups();
  }

  getGroups() {
    getElement("/api/grades/")
      .then((data) => {
        // let grades = [];
        //
        // for (let i=0; i<data.length; i++) {
        //   if (data[i].course_name == this.state.name) {
        //     grades.push(data[i]);
        //   }
        // }

        this.setState(() => {
          return {
            loaded: true,
            groups: groups,
          };
        });
      });
  }

  prepareView() {
    if (this.state.loaded == false) {
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else if (this.state.groups.length === 0){
      return (
        <Col xs={12} className="mb-5 mt-5">
          <Row className="p-2">
            <h1 className="heading">There is no group in course {this.state.name}</h1>
          </Row>
          <Row className="pr-5 pl-5 mb-4">
            <Col xs={7}></Col>
            <Col xs={5} className="mt-4 pr-5 text-right">
              <Button path="/teacher/group/add" text="Add group"/>
            </Col>
          </Row>
        </Col>
      );
    } else {
      return (
        <Col>
          <Row className="p-2">
            {/*{this.state.groups.map((group) => {*/}
            {/*  return (*/}
            {/*    <Col xs={12} key={group.name}>*/}
            {/*      <GroupIcon*/}
            {/*        groupName={group.name}*/}
            {/*        students={group.students}*/}
            {/*      />*/}
            {/*    </Col>*/}
            {/*  );*/}
            {/*})}*/}
          </Row>
          <Row className="pr-5 pl-5 mb-4">
            <Col xs={7}></Col>
            <Col xs={5} className="mt-4 pr-5 text-right">
              <Button path="/teacher/group/add" text="Add group"/>
            </Col>
          </Row>
        </Col>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <Header
          button1_text="My Courses"
          button2_text="Log Out"
          button1_path="/teacher/courses"
          button2_path="/"
          is_logout={true}
        />
        <Container fluid>
          <Row className="mt-4 mb-5 ml-3">
            <Col xs={2}></Col>
            <Col xs={9} className="title text-left">
              {this.state.name}
            </Col>
          </Row>
          <Row>
            <Col xs={2} className="ml-0 pl-0">
              <Sidebar />
            </Col>
            <Col xs={10}>{this.prepareView()}</Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default Groups;
