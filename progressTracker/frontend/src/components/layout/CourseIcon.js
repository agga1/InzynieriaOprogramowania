import React, { Component } from 'react'
import { Card, CardBody, CardText, CardTitle, Col } from 'reactstrap';
import Button from './Button'

export class CourseIcon extends Component { 
    getInfo(isStudent){
        if(isStudent=='true'){
            return (<CardText className="card-text">
                <dt className="col-xs-4">Teacher:</dt>
                <dd className="col-xs-8">{this.props.teacher_name}</dd>
                </CardText> )
        }
        else{
            return(<CardText></CardText>);
        }
    }

    setUrl(url){
        if(localStorage.getItem("url")){
            localStorage.removeItem("url");
        }
        localStorage.setItem("url", url);
    }


    render() {
        return (
            <div>
                <Card className="icon">
                    <CardBody>
                        <CardTitle tag="h1">{this.props.course_name}</CardTitle>
                        {this.getInfo(localStorage.getItem('isStudent'))}
                    </CardBody>

                    <Col className="text-right mb-3">
                        <Button variant="primary" path={this.props.course_details_path} onClick={() => this.setUrl(this.props.course_url)} text="View details"/>
                    </Col>
                </Card>
            </div>
        )
    }
}

export default CourseIcon