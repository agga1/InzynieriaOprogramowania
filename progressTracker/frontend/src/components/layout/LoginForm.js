import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export class LoginForm extends Component {
    render() {
        return(
            <Form className="form">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="form_text">Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" className="input_window"/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="form_text">Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" className="input_window"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Log In
                </Button>
        </Form>
        )
        
    }
}

export default LoginForm
