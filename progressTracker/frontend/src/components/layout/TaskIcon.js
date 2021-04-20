import React, { Component } from 'react'
import { Card, CardBody, Row, CardTitle, Col, List, ListInlineItem } from 'reactstrap';
import Button from './Button'

export class TaskIcon extends Component { 
    render() {
        return (
            <div>
                <Card className="icon">
                    <Row >
                        <Col xs={11}>
                        <CardBody className="pb-0">
                            <CardTitle tag="h1">{this.props.task_name}</CardTitle>
                        </CardBody>
                        </Col>
                        <Col xs={1} className="pt-3" >
                            <h1>{this.props.max_points}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <CardBody className="pt-0">
                                <List >
                                    <ListInlineItem className="card-text"><b>Deadline:</b></ListInlineItem>
                                    <ListInlineItem className="card-text">{this.props.deadline}</ListInlineItem>
                                </List>
                            </CardBody>
                        </Col>
                        

                        <Col xs={6} className="text-right task-btn">
                            <List >
                                <ListInlineItem href="#" className="task-link pr-3">+Task</ListInlineItem>
                                <ListInlineItem href="#"  className="task-link pr-3 ">Rate</ListInlineItem>
                                <ListInlineItem href="{this.props.task_details_path}"  className="task-link">Details</ListInlineItem>
                            </List>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default TaskIcon