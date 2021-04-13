import React, { Component } from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap';
import Button from './Button'

export class EmptyCard extends Component { 
    render() {
        return (
            <div>
                <Card className="empty-card">
                    <CardBody>
                        <CardTitle tag="h1">No data to display</CardTitle>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default EmptyCard