import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from './Button'
import SelectStudentsField from './SelectStudentsField'



export class AddCourseForm extends Component {

    render() {
        return(
            <Form className="form" style={{"marginBottom":"10rem"}}>
                <Form.Group controlId="formName">
                    <Form.Label className="form_text padding-left-10">Course name</Form.Label>
                    <Form.Control type="text" placeholder="Enter course name" className="input_window"  onChange={this.props.handleName} value={this.props.name || ''} />
                </Form.Group>

                <Form.Group controlId="formTeacher">
                    <Form.Label className="form_text padding-left-10">Teacher</Form.Label>
                    <Form.Control type="text" className="input_window" placeholder={this.props.teacher} readOnly />
                </Form.Group>

                <Form.Group controlId="formPassThreshold">
                    <Form.Label className="form_text text-left padding-left-10">Pass threshold</Form.Label>
                    <Form.Control type="text" placeholder="Enter pass threshold" className="input_window" onChange={this.props.handlePassThreshold} value={this.props.pass_threshold || ''} />
                </Form.Group>

                <Form.Group controlId="formStudents">
                    <Form.Label className="form_text padding-left-10">Enroll students</Form.Label>
                    <SelectStudentsField 
                        chosen_students = {this.props.chosen_students}
                        handleStudents={this.props.handleStudents}
                        />
                </Form.Group>
                

                <Button className="form-group mt-3" type="submit" onClick={this.props.handleSubmit} text="Add course">
                </Button>
            </Form>
        )
        

    }
}

export default AddCourseForm
