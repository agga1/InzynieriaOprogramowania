import React, { Component } from 'react'
import { Card, CardBody, CardText, CardTitle, Col } from 'reactstrap';
import Button from './Button'

export class TaskIcon extends Component { 
    render() {
        return (
            <div>
                <Card className="icon">
                    <CardBody>
                        <CardTitle tag="h1">{this.props.task_name}</CardTitle>
                        <CardText>
                        <dt className="col-xs-4 card-text">Deadline:</dt>
                        <dd className="col-xs-8 card-text">{this.props.deadline}</dd>
                        </CardText>
                    </CardBody>

                    <Col className="text-right mb-3">
                        <Button variant="primary" path={this.props.task_details_path} text="View details"/>
                    </Col>
                </Card>
            </div>
        )
    }
}

export default TaskIcon