import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export class LoginForm extends Component {
  render() {
    return(
      <Form className="form" onSubmit={e => this.props.handleLogin(e, {
        username : this.props.username,
        password : this.props.password
      })}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="form_text">Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" className="input_window"  onChange={this.props.handleLoginChange} value={this.props.username || ''} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label className="form_text">Password</Form.Label>
          <Form.Control type="password" placeholder="Password" className="input_window"  onChange={this.props.handlePasswordChange} value={this.props.password || ''} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log In
        </Button>
        {this.props.error != ''? <h6 className="heading pt-3 pl-3">Login failed: {this.props.error}</h6> : null}
      </Form>
    )
  }
}

export default LoginForm
