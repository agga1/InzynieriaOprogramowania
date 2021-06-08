import React, {  Component } from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter, Label, Input, Col, Row } from 'reactstrap';
import Button from './Button';
import {FormGroup} from "react-bootstrap";
import Select from "react-select";
import {extractID} from "../functions/helpers";

export class RateGroupModal extends Component {
  prepareOptions() {
    let tab = [];
    for (let option of this.props.tasks) {
      tab.push({
        value: extractID(option.url),
        label: option.name
      })
    }
    return tab
  }

  render() {
    return (
      <Modal isOpen={this.props.show} unmountOnClose={false}>
        <ModalHeader>{this.props.title}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="rateField">Task</Label>
            <Row className="mb-2">
              <Col xs={12}>
                <Select
                  classNamePrefix="input_window "
                  isMulti={false}
                  value={this.props.selectedTask}
                  onChange={this.props.handleSelect}
                  options={this.prepareOptions()}
                />
              </Col>
            </Row>
            <Label for="rateField">Grade</Label>
            <Row>
              <Col xs={6}>
                <Input type="text" value={this.props.rate || ''} onChange={this.props.handleRateChange} className="input_window" name="rate" id="rateField"/>
              </Col>
              <Col xs={6}>
                <h4>/{this.props.task.grade_max}</h4>
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

export default RateGroupModal
