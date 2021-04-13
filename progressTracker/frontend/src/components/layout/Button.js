import React, { Component } from 'react'

export class Button extends Component {
    render() {
        return (
            <div>
                <a href={this.props.path} className="btn btn-lg" role="button" aria-pressed="true" onClick={this.props.onClick}>{this.props.text} </a>
            </div>
        )
    }
}

export default Button

