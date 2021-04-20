import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom"
import Button from './Button'
import { Container, Row, Col } from 'reactstrap';


export class AddTaskForm extends Component {
    render() {
        return(
            <Form className="form" >
                <Row xs={2}>
                    <Col xs={12}>
                        <Form.Group controlId="formBasicName">
                            <Form.Label className="form_text">Task name</Form.Label>
                            <Form.Control type="text" className="input_window" onChange={this.props.handleName} value={this.props.name || ''} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row xs={6}>
                    <Col xs={12}>
                        <Form.Group controlId="formBasicDescription">
                            <Form.Label className="form_text">Description</Form.Label>
                            <Form.Control xs={12} type="text" className="input_window" onChange={this.props.handleDescription} value={this.props.description || ''} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row xs={4}>
                    <Col xs={2}>
                        <Form.Group controlId="formBasicGradeMin">
                            <Form.Label className="form_text">Grade min</Form.Label>
                            <Form.Control type="text" className="input_window" onChange={this.props.handleGradeMin} value={this.props.gradeMin || 0} />
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group controlId="formBasicGradeMax">
                            <Form.Label className="form_text">Grade max</Form.Label>
                            <Form.Control type="text" className="input_window" onChange={this.props.handleGradeMax} value={this.props.gradeMax || 0} />
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group controlId="formBasicWeight">
                            <Form.Label className="form_text">Weight</Form.Label>
                            <Form.Control type="text" className="input_window" onChange={this.props.handleWeight} value={this.props.weight || 0} />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group controlId="formBasicDeadline">
                            <Form.Label className="form_text">Deadline</Form.Label>
                            <Form.Control type="text" className="input_window" onChange={this.props.handleDeadline} value={this.props.deadline || ''} />
                        </Form.Group>
                    </Col>
                </Row>

                <Button className="form-group" type="submit" onClick={this.props.handleSubmit} text="Create">
                </Button>
        </Form>
        )

    }
}

export default AddTaskForm
