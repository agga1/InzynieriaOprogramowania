import React, { Component } from 'react'

export class Button extends Component {
    render() {
        return (
            <div>
                <a href="#" className="btn btn-lg" role="button" aria-pressed="true">{this.props.text}</a>
            </div>
        )
    }
}

export default Button

