import React, { Component } from 'react'
import { Card, CardBody, Spinner } from 'reactstrap';
import Button from './Button'

export class EmptyCard extends Component { 
    render() {
        return (
            <div className={`d-flex justify-content-center ${ this.props.className }`}>
                <Spinner className="text-primary spinner-border-lg" role="status" />
            </div>
        )
    }
}

export default EmptyCard