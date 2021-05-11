import React, { Component, Fragment } from "react";
import {
  Card,
  CardBody,
  Button,
  Row,
  CardTitle,
  Col,
  List,
  ListInlineItem,
  Spinner,
} from "reactstrap";
import {getFullRule} from '../functions/helpers'

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
              <CardTitle className="achievement-name">Achievement</CardTitle>
            </CardBody>
            </Col>
            <Col xs={8}>
              <CardTitle className="achievement-rule">
                {getFullRule(this.props.kind, this.props.args)}
              </CardTitle>
            </Col>
          </Row>

        </Card>
      </Fragment>
    );
  }
}

export default AchievementIcon;
