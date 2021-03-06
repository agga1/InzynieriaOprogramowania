import React, { Component } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

export class AddCourseIcon extends Component {
  render() {
    return (
      <div>
        <Card className="course-icon">
          <CardBody>
            <CardTitle tag="h1">Add new course</CardTitle>
            <div className="empty-icon">
              <a href={this.props.path}>
                <img
                  src="../../static/images/add_icon.png"
                  className="card-img-top add-icon"
                  alt="add course icon"
                />
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AddCourseIcon;
