import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Button from "../Button";
import {Row, Col} from "reactstrap";
import Select from 'react-select'
import {options, convertAchievementRule} from '../../functions/helpers'


export class AddAchievementForm extends Component {
  prepareOptions() {
    let tab = [];
    for (let option of options) {
      tab.push({
        value: convertAchievementRule(option),
        label: option
      })
    }
    return tab
  }


  render() {
    return (
      <Form className="form">
        <Row>
          <Col xs={12}>
            <Form.Group controlId="formBasicName">
              <Form.Label className="form_text">Name</Form.Label>
              <Form.Control
                type="text"
                className="input_window"
                onChange={this.props.handleName}
                value={this.props.name || ""}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Form.Group controlId="formBasicDescription">
              <Form.Label className="form_text">Student will be granted this achievement once he/she:</Form.Label>
              <Select
                classNamePrefix="input_window "
                isMulti={false}
                value={this.props.rule}
                onChange={this.props.handleRule}
                options={this.prepareOptions()}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row style={{alignItems: "baseline"}}>
          <Col xs={2}>
            <Form.Group as={Row}>
              <Form.Label className="form_text_variable">X =</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  className="input_window"
                  onChange={this.props.handleX}
                  value={this.props.x || 0}
                  readOnly={this.props.readOnly}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Form.Group as={Row}>
              <Form.Label className="form_text_variable">Y =</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  className="input_window"
                  onChange={this.props.handleY}
                  value={this.props.y || 0}
                  readOnly={this.props.readOnly}
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="row justify-content-md-end">
            <Button
              className="form-group mt-3"
              type="submit"
              onClick={this.props.handleSubmit}
              text={this.props.buttonText}
            />
          </Col>
        </Row>
      </Form>
    );
  }
}

export default AddAchievementForm;
