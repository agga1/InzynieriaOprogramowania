import React, { Component, Fragment } from "react";
import { Card, CardBody, Row, CardTitle, Col, List, ListInlineItem} from "reactstrap";
import Spinner from "./Spinner"

export class TaskIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: "",
      show: false,
      loaded: false,
      children: [],
      grades: [],
      grade: "-",
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
    for (let i = 0; i < grades.length; i++) {
      if (grades[i].task_name == taskName) {
        return grades[i].value.toString();
      }
    }

    return "-";
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
                      url={"/api/tasks/" + task.id + "/"}
                      max_points={task.grade_max}
                      grade={this.getGrade(task.name, grades)}
                      grades={grades}
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
            <Col xs={11}>
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
          <Col xs={11}>
            <Spinner />
          </Col>
        </Row>
      );
    }
  };

  getChildren() {
    fetch(this.props.url + "children", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status > 400) {
          console.log("Something went wrong!");
        }
        return response.json();
      })
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
    // if (this.state.loaded) {
      if (sessionStorage.getItem("isStudent") == "true") {
        return (
          <List>
            <ListInlineItem className="task-link">
              <a href="/student/task/details" className="custom-btn">
                Details
              </a>
            </ListInlineItem>
          </List>
        );
      } else {
        return (
          <List>
            <ListInlineItem className="task-link pr-3">
              <a
                href="/teacher/task/add"
                className="custom-btn"
                onClick={() => this.setTask(taskUrl)}
              >
                +Task
              </a>
            </ListInlineItem>
            <ListInlineItem className="task-link pr-3 ">
              <a
                href="/teacher/task/grades"
                className="custom-btn"
                onClick={() => {
                  this.setTask(taskUrl);
                  this.setIsParentTask(this.state.children.length > 0);
                }}
              >
                Grades
              </a>
            </ListInlineItem>
            <ListInlineItem className="task-link">
              <a
                href="/teacher/task/details"
                className="custom-btn"
                onClick={() => this.setTask(taskUrl)}
              >
                Details
              </a>
            </ListInlineItem>
          </List>
        );
      }
    // } else {
    //   return <Spinner />;
    // }
  }

  render() {
    return (
      <Fragment>
        <Card
          onClick={this.onClick}
          className={`icon mb-4 ${this.state.style}`}
        >
          <Row>
            <Col xs={9}>
              <CardBody className="pb-0">
                <CardTitle tag="h1">{this.props.task_name}</CardTitle>
              </CardBody>
            </Col>
            <Col xs={3} className="text-right pl-0 pt-3">
              <div className=" points">
                {sessionStorage.getItem("isStudent") == "false" ? ( "" ) : ( <h1 className="your-points">{this.props.grade}/</h1>)}
                <h1 className="max-points">{this.props.max_points}</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <CardBody className="pt-0">
                <List>
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
