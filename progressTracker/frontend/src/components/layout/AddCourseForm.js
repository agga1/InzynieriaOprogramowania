import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom"
import Button from './Button'


export class AddCourseForm extends Component {
    

    render() {
        return(
            <Form className="form">
                <Form.Group controlId="formName">
                    <Form.Label className="form_text">Course name</Form.Label>
                    <Form.Control type="text" placeholder="Enter course name" className="input_window"  onChange={this.props.handleName} value={this.props.name || ''} />
                </Form.Group>

                <Form.Group controlId="formTeacher">
                    <Form.Label className="form_text">Teacher</Form.Label>
                    <Form.Control type="text" placeholder={this.props.teacher} readOnly />
                </Form.Group>

                <Form.Group controlId="formPassThreshold">
                    <Form.Label className="form_text">Pass threshold</Form.Label>
                    <Form.Control type="text" placeholder="Enter pass threshold" className="input_window"  onChange={this.props.handlePassThreshold} value={this.props.pass_threshold || ''} />
                </Form.Group>

                <Form.Group controlId="formStudents">
                    <Form.Label className="students">Enroll students</Form.Label>
                    <Form.Control as="select" onChange={this.props.handleStudents} value={this.props.students || ''} as="select" multiple>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Form.Control>
                </Form.Group>

                <Button type="submit"  onClick={this.props.handleSubmit} text="Add course">
                </Button>
            </Form>
        )
        
    }
}

export default AddCourseForm
