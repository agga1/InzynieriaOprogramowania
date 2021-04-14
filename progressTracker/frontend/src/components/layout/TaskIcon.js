import React, { Component } from 'react'
import { Card, CardBody, Row, CardTitle, Col, List, ListInlineItem } from 'reactstrap';
import Button from './Button'

export class TaskIcon extends Component { 
    render() {
        return (
            <div>
                <Card className="icon">
                    <Row>
                        <Col xs={8}>
                            <CardBody>
                                <CardTitle tag="h1">{this.props.task_name}</CardTitle>
                                <List >
                                    <ListInlineItem className="card-text"><b>Deadline:</b></ListInlineItem>
                                    <ListInlineItem className="card-text">{this.props.deadline}</ListInlineItem>
                                </List>
                                
                            </CardBody>
                        </Col>
                        

                        <Col xs={4} className="text-right task-btn">
                            <Button variant="primary" path={this.props.task_details_path} text="View details"/>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default TaskIcon