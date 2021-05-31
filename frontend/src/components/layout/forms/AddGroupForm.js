import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "../Button";
import { Row, Col } from "reactstrap";
import SelectStudentsField from "../SelectStudentsField";

export class AddGroupForm extends Component {
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
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col xs={12} >
            <Form.Group controlId="formBasicDescription">
              <Form.Label className="form_text">Students</Form.Label>
              <SelectStudentsField
                chosen_students = {this.props.chosen_students}
                handleStudents={this.props.handleStudents}
              />
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

export default AddGroupForm;
