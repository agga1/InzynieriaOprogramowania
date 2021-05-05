import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "./Button";
import { Row, Col } from "reactstrap";
import Select from 'react-select'

export class AddTaskForm extends Component {
  render() {
    return (
      <Form className="form">
        <Row>
          <Col xs={12}>
            <Form.Group controlId="formBasicName">
              <Form.Label className="form_text">Task name</Form.Label>
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
        <Row className="pt-3">
          <Col xs={12} >
            <Form.Group controlId="formBasicDescription">
              <Form.Label className="form_text">Description</Form.Label>
              <Form.Control
                xs={12}
                type="text"
                as="textarea"
                rows={7}
                className="input_window"
                onChange={this.props.handleDescription}
                value={this.props.description || ""}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="pt-3" style={{ alignItems: "baseline" }}>
          <Col md={2}>
            <Form.Group controlId="formBasicGradeMin">
              <Form.Label className="form_text">Grade min</Form.Label>
              <Form.Control
                type="text"
                className="input_window"
                onChange={this.props.handleGradeMin}
                value={this.props.gradeMin || 0}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="formBasicGradeMax">
              <Form.Label className="form_text">Grade max</Form.Label>
              <Form.Control
                type="text"
                className="input_window"
                onChange={this.props.handleGradeMax}
                value={this.props.gradeMax || 0}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={4} xl={3}>
            <Form.Group controlId="formBasicDeadline">
              <Form.Label className="form_text"> Deadline </Form.Label>
              <Form.Control
                type="text"
                className="input_window"
                onChange={this.props.handleDeadline}
                value={this.props.deadline || ""}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={4} xl={3}>
            <Form.Group controlId="formBasicAggregation">
              <Form.Label className="form_text">Aggregation method</Form.Label>
              <Select 
                classNamePrefix="input_window "
                isMulti = {false}
                value = {this.props.aggregation}
                onChange={this.props.handleAggregation}
                options={this.props.aggregationOptions}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={2} style={{display: this.props.aggregation.value == "WAVG" ? 'block' : 'none' }}>
            <Form.Group controlId="formBasicWeight">
              <Form.Label className="form_text">Weight</Form.Label>
              <Form.Control
                type="text"
                className="input_window"
                onChange={this.props.handleWeight}
                value={this.props.weight || 0}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group controlId="formBasicCheckbox">
            <Form.Label className="form_text"></Form.Label>
              <Form.Check
                type="radio"
                label="is extra?"
                className="form_text"
                onChange={this.props.handleExtra}
                readOnly={this.props.readOnly}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          className="form-group mt-3"
          type="submit"
          onClick={this.props.handleSubmit}
          text={this.props.buttonText}
        ></Button>
      </Form>
    );
  }
}

export default AddTaskForm;
