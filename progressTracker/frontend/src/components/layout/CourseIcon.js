import React, { Component } from 'react'
import Button from './Button'

export class CourseIcon extends Component {
    render() {
        return (
            <div class="card course-icon">
                <div class="card-header">{this.props.course_name}</div>
                <div class="card-body">
                    <dt class="col-sm-3">Class dates:</dt>
                    <dd class="col-sm-9">{this.props.class_dates}</dd>

                    <dt class="col-sm-3">Teacher:</dt>
                    <dd class="col-sm-9">{this.props.teacher}</dd>

                    <dt class="col-sm-3">Description:</dt>
                    <dd class="col-sm-9">{this.props.desc}</dd>
                </div>
            
                <Button variant="primary" path={this.props.course_details_path}>
                    View details
                </Button>
            </div>
        )
    }
}

export default CourseIcon