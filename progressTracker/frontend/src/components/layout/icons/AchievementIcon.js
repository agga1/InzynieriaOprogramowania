import React, { Component, Fragment } from "react";
import {
  Card,
  CardBody,
  Button,
  Row,
  CardTitle,
  Col
} from "reactstrap";
import {getFullRule} from '../../functions/helpers'

export class AchievementIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kind: "",
      args: ""
    };
  }

  render() {
    return (
      <Fragment>
        <Card
          className={`icon mb-4`}
        >
          <Row>
            <Col xs={4}>
            <CardBody>
              <CardTitle className="achievement-name">{this.props.name}</CardTitle>
            </CardBody>
            </Col>
            <Col xs={6}>
              <CardTitle className="achievement-rule">
                {getFullRule(this.props.kind, this.props.args)}
              </CardTitle>
            </Col>
            <Col xs={2}>
              <CardTitle className="cancel-achievement">
                <a
                  // href="/teacher/course/achievements"
                  className="cancel-achievement-btn"
                  onClick={() => {
                    this.props.handleCancel(this.props.name)
                  }}
                >
                  Cancel
                </a>
              </CardTitle>
            </Col>
          </Row>

        </Card>
      </Fragment>
    );
  }
}

export default AchievementIcon;
