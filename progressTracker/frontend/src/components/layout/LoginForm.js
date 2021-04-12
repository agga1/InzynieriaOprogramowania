import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom"


export class LoginForm extends Component {
    render() {
        return(
            <Form className="form" onSubmit={e => this.props.handleLogin(e, {
                username : this.props.username, 
                password : this.props.password
            })
             }>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="form_text">Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" className="input_window"  onChange={this.props.handleLoginChange} value={this.props.username || ''} />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="form_text">Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" className="input_window"  onChange={this.props.handlePasswordChange} value={this.props.password || ''} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Log In
                </Button>
        </Form>
        )
        
    }
}

export default LoginForm
