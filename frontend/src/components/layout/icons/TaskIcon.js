import React, { Component, Fragment } from "react";
import { Card, CardBody, Row, CardTitle, Col, List, ListInlineItem} from "reactstrap";
import { getElement } from "../../functions/helpers";
import Spinner from "../Spinner"
import { Spinner as MiniSpinner } from "reactstrap";

export class TaskIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: "",
      show: false,
      loaded: false,
      children: [],
      // grades: this.props.grades,
    };
    this.onClick = this.onClick.bind(this);
    this.getChildren();
  }

  onClick = () => {
    if (this.state.show == true) {
      this.setState((state) => ({
        show: !state.show,
        style: "",
      }));
    } else {
      this.setState((state) => ({
        show: !state.show,
        style: "clicked",
      }));
    }
  };

  getGrade(taskName, grades) {
    console.log(this.props.gradesLen);
    let i;
    for (i = 0; i < grades.length; i++) {
      if (grades[i].task_name == taskName) {
        return grades[i].value.toString();
      }
    }

    if(i === this.props.gradesLen)
      return '-';

    return <MiniSpinner className="minispinner" animation="border"/>;
  }

  getLinkPrefix() {
    const courseUrl = localStorage.getItem('courseUrl');

    let prefix = "";
    let slashes = 0;
    for (let i = 0; i < courseUrl.length; i++) {
      if (courseUrl[i] === '/')
        slashes++;
      prefix += courseUrl[i];
      if (slashes === 3)
        break;
    }
    return prefix;
  }

  showChildren = (grades) => {
    if (this.state.show && this.state.loaded) {
      if (this.state.show && this.state.children.length != 0) {
        return (
          <Row className="p-2">
            <Col xs={1}></Col>
            <Col xs={11}>
              {this.state.children.map((task) => {
                return (
                  <Col xs={12} key={task.name + task.deadline}>
                    <TaskIcon
                      task_name={task.name}
                      deadline={task.deadline}
                      url={this.getLinkPrefix() + "api/tasks/" + task.id + "/"}
                      max_points={task.grade_max}
                      grade={this.getGrade(task.name, grades)}
                      grades={grades}
                      gradesLen={ this.props.gradesLen === -1 ? -1 : grades.length}
                    />
                  </Col>
                );
              })}
            </Col>
          </Row>
        );
      } else {
        return (
          <Row className="p-2">
            <Col xs={1}></Col>
            <Col xs={11} >
              <p>
                Task "{this.props.task_name}"" does not have any child tasks
              </p>
            </Col>
          </Row>
        );
      }
    } else if (this.state.show && !this.state.loaded) {
      return (
        <Row className="p-2">
          <Col xs={1}></Col>
          <Col xs={11} className="pb-2" >
            <Spinner className="spinner-no-style"/>
          </Col>
        </Row>
      );
    }
  };

  getChildren() {
    getElement(this.props.url + "children")
      .then((data) => {
        this.setState(() => {
          return {
            children: data.children,
            loaded: true,
          };
        });
      });
  }

  setTask(taskUrl) {
    if (localStorage.getItem("taskUrl")) {
      localStorage.removeItem("taskUrl");
    }
    localStorage.setItem("taskUrl", taskUrl);
  }

  setIsParentTask(isParentTask) {
    if (localStorage.getItem("isParentTask")) {
      localStorage.removeItem("isParentTask");
    }
    localStorage.setItem("isParentTask", isParentTask);
  }

  prepareButtons(taskUrl) {
    if (localStorage.getItem("isStudent") == "true") {
      return (
        <List className="mb-1">
          <ListInlineItem className="pr-3">
            <a
              href="/student/task/details"
              className="task-link"
              onClick={() => this.setTask(taskUrl)}
            >
              Details
            </a>
          </ListInlineItem>
          <ListInlineItem className="pr-3">
            <a
              href="/student/task/histogram"
              className="task-link"
              onClick={() => this.setTask(taskUrl)}
            >
              <img src='./../../../static/images/histogram.png' alt='histogram_button' height="25px" width="25px"/>
            </a>
          </ListInlineItem>
        </List>
      );
    } else {
      return (
        <List className="mb-1">
          <ListInlineItem className="pr-3">
            <a
              href="/teacher/task/add"
              className="task-link"
              onClick={() => this.setTask(taskUrl)}
            >
              +Task
            </a>
          </ListInlineItem>
          <ListInlineItem className="pr-3 ">
            <a
              href="/teacher/task/grades"
              className="task-link"
              onClick={() => {
                this.setTask(taskUrl);
                this.setIsParentTask(this.state.children.length > 0);
              }}
            >
              Grades
            </a>
          </ListInlineItem>
          <ListInlineItem className="pr-3">
            <a
              href="/teacher/task/details"
              className="task-link"
              onClick={() => this.setTask(taskUrl)}
            >
              Details
            </a>
          </ListInlineItem>
          <ListInlineItem className="pr-3">
            <a
              href="/teacher/task/histogram"
              className="task-link"
              onClick={() => this.setTask(taskUrl)}
            >
             <img src='./../../../static/images/histogram.png' alt='histogram_button' height="25px" width="25px"/>
            </a>
          </ListInlineItem>
        </List>
      );
    }
  }

  

  render() {
    console.log(this.props.grades);
    console.log(this.props.grade);
    return (
      <Fragment>
        <Card
          onClick={this.onClick}
          className={`icon mb-4 ${this.state.style}`}
        >
          <Row>
            <Col xs={localStorage.getItem('isStudent')=='true' ? 9 : 11}>
              <CardBody className="pb-0 pt-3">
                <CardTitle tag="h1">{this.props.task_name}</CardTitle>
              </CardBody>
            </Col>
            <Col xs={localStorage.getItem('isStudent')=='true' ? 3 : 1} className="text-right pl-0 pt-3">
              <div className=" points">
                {localStorage.getItem("isStudent") == "false" ? ( "" ) : ( <h1 className="your-points">{this.props.grade}/</h1>)}
                <h1 className="max-points">{this.props.max_points}</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <CardBody className="pt-0 pb-0">
                <List className="mb-0">
                  <ListInlineItem className="card-text">
                    <b>Deadline:</b>
                  </ListInlineItem>
                  <ListInlineItem className="card-text">
                    {this.props.deadline}
                  </ListInlineItem>
                </List>
              </CardBody>
            </Col>

            <Col xs={6} className="text-right task-btn">
              {this.prepareButtons(this.props.url)}
            </Col>
          </Row>
        </Card>
        {this.showChildren(this.props.grades)}
      </Fragment>
    );
  }
}

export default TaskIcon;
