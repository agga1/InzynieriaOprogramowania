import React, {  Component } from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter, Label, Input,Col, Row } from 'reactstrap';
import Button from '../Button';
import {FormGroup} from "react-bootstrap";

export class ModalComponent extends Component {
  render() {
    return (
      <Modal isOpen={this.props.show} unmountOnClose={false}>
        <ModalHeader>{this.props.title}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="rateField">Rate</Label>
            <Row>
              <Col xs={6}>
                <Input type="text" value={this.props.rate || ''} onChange={this.props.handleChange} className="input_window" name="rate" id="rateField"/>
              </Col>
              <Col xs={6}>
                <h4>/{this.props.max_grade}</h4>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" onClick={this.props.handleSubmit} text="Save"/>
          <Button type="submit" className="btn-rev" onClick={this.props.handleCancel} text="Cancel"/>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ModalComponent
