import React, { Component, Fragment } from "react";
import { Card, CardBody, Row, CardTitle, Col, List, ListInlineItem} from "reactstrap";
import Button from "../Button";

export class GroupIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <Fragment>
        <Card
          className={`icon mb-4`}
        >
          <Row>
            <Col xs={10} className="title text-left">
              <CardBody className="pb-0 pt-3">
                <CardTitle tag="h1" className="group-title">{this.props.name}</CardTitle>
              </CardBody>
            </Col>
            <Col xs={2} className="text-right pl-0 pt-3">
              <Button
                className="w-50 h-20 mr-3 mt-2"
                onClick={() => this.props.showRate(this.props.name, this.props.id, this.props.studentsIDs)}
                text="Rate"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={10} className="text-left">
              <CardBody className="pt-0 pb-0">
                <List className="mb-0">
                  <ListInlineItem className="card-text">
                    <b className="group-students-list-title">Students:</b>
                  </ListInlineItem>
                  {this.props.students.map((student) => {
                    return (
                      <ListInlineItem className="card-text" key={student}>
                        <b className="group-students-list">{student}</b>
                      </ListInlineItem>
                    );
                  })}
                  <ListInlineItem className="card-text">
                    {this.props.deadline}
                  </ListInlineItem>
                </List>
              </CardBody>
            </Col>

            <Col xs={2} className="text-right card-btn">
              <a
                role="button"
                className="task-link mr-3"
                onClick={() => this.props.showDelete(this.props.id)}
              >
                Ungroup
              </a>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}

export default GroupIcon;
