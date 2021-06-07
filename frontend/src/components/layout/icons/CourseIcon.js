import React, { Component } from 'react'
import { Card, CardBody, CardText, CardTitle, Col } from 'reactstrap';
import Button from '../Button'

export class CourseIcon extends Component {
  getInfo(isStudent){
    if(isStudent=='true'){
      return (<CardText className="card-text">
        <dt className="col-xs-4">Teacher:</dt>
        <dd className="col-xs-8">{this.props.teacher_name}</dd>
        <dt className="col-xs-4">Description:</dt>
        <dd className="col-xs-8">{this.props.description}</dd>
      </CardText> )
    }
    else{
      return(<CardText>
          <dt className="col-xs-4">Description:</dt>
          <dd className="col-xs-8">{this.props.description}</dd>
        </CardText>
      );
    }
  }

  setCourse(courseName, courseUrl){
    if (localStorage.getItem('courseUrl')){
      localStorage.removeItem('courseUrl');
    }
    localStorage.setItem('courseUrl', courseUrl);

    if (localStorage.getItem('courseName')){
      localStorage.removeItem('courseName');
    }
    localStorage.setItem('courseName', courseName);
  }


  render() {
    return (
      <div>
        <Card className="course-icon">
          <CardBody>
            <CardTitle tag="h1">{this.props.course_name}</CardTitle>
            {this.getInfo(localStorage.getItem('isStudent'))}
          </CardBody>

          <Col className="text-right mb-3">
            <Button
              variant="primary"
              path={this.props.course_details_path}
              onClick={() => this.setCourse(this.props.course_name, this.props.course_url)}
              text="View details"
            />
          </Col>
        </Card>
      </div>
    )
  }
}

export default CourseIcon