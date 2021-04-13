import React, { Component } from 'react'
import { Card, CardBody, CardText, CardTitle, Col } from 'reactstrap';
import Button from './Button'

export class CourseIcon extends Component { 
    getInfo(user){
        if(user ==='student'){
            return (<CardText>
                <dt className="col-xs-4 card-text">Teacher:</dt>
                <dd className="col-xs-8 card-text">{this.props.teacher_name}</dd>
                </CardText> )
        }
        else{
            return(<CardText></CardText>)
        }
    }


    render() {
        return (
            <div>
                <Card className="course-icon">
                    <CardBody>
                        <CardTitle tag="h2">{this.props.course_name}</CardTitle>
                        {this.getInfo(this.props.user)}
                    </CardBody>

                    <Col className="text-right mb-3">
                        <Button variant="primary" path={this.props.course_details_path} text="View details"/>
                    </Col>
                </Card>
            </div>
        )
    }
}

export default CourseIcon