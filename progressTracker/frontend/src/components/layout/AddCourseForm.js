import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom"
import Button from './Button'


export class AddCourseForm extends Component {
    render() {
        return(
            <Form className="form" >
                <Form.Group controlId="formBasicName">
                    <Form.Label className="form_text">Course name</Form.Label>
                    <Form.Control type="text" placeholder="Enter course name" className="input_window"  onChange={this.props.handleName} value={this.props.name || ''} />
                </Form.Group>

                <Form.Group controlId="formBasicPassThreshold">
                    <Form.Label className="form_text">Pass threshold</Form.Label>
                    <Form.Control type="text" placeholder="Enter pass threshold" className="input_window"  onChange={this.props.handlePassThreshold} value={this.props.pass_threshold || ''} />
                </Form.Group>

                <Button type="submit" path={this.props.url} text="Add course">
                </Button>
        </Form>
        )
        
    }
}

export default AddCourseForm
