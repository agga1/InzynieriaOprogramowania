import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom"
import Button from './Button'


export class AddTaskForm extends Component {
    render() {
        return(
            <Form className="form" >
                <Form.Group controlId="formBasicName">
                    <Form.Label className="form_text">Task name</Form.Label>
                    <Form.Control type="text" placeholder="Enter task name" className="input_window"  onChange={this.props.handleName} value={this.props.name || ''} />
                </Form.Group>

                <Button type="submit" path={this.props.url} text="Add course">
                </Button>
        </Form>
        )
        
    }
}

export default AddTaskForm
