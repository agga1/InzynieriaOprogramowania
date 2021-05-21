import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Button from "../Button";
import {Row, Col} from "reactstrap";
import Select from 'react-select'
import {rules, convertAchievementRule, extractID} from '../../functions/helpers'


export class AddAchievementForm extends Component {
  prepareOptions() {
    let tab = [];
    for (let option of rules) {
      tab.push({
        value: convertAchievementRule(option),
        label: option
      })
    }
    return tab
  }

  prepareXOptions() {
    let tab = [];
    for (let option of this.props.tasks) {
      tab.push({
        value: extractID(option.url),
        label: option.name
      })
    }
    return tab
  }

  prepareXField() {
    if (this.props.rule.value === "THRESH") {
      return (
        <Row style={{alignItems: "baseline"}}>
          <Col xs={3}>
            <Form.Group as={Row}>
              <Form.Label className="form_text_variable">X =</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  className="input_window"
                  onChange={this.props.handleX}
                  value={this.props.x}
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>
      )
    } else if (this.props.rule.value === "MAX") {
      return (
        <Row style={{alignItems: "baseline"}}>
          <Col xs={3}>
            <Form.Group as={Row}>
              <Form.Label className="form_text_variable">X =</Form.Label>
              <Col>
                <Select
                  classNamePrefix="input_window "
                  isMulti={false}
                  value={this.props.selectedX}
                  onChange={this.props.handleSelectX}
                  options={this.prepareXOptions()}
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row style={{alignItems: "baseline"}}>
        </Row>
      )
    }
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
        {this.prepareXField()}
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
