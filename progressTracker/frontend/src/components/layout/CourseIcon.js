import React, { Component } from 'react'
import Button from './Button'

export class CourseIcon extends Component {
    render() {
        return (
            <div class="col-3 m-3">
                <div class="card course-icon">
                    <div class="card-body">
                        <h2 class="card-title">{this.props.course_name}</h2>
                        <dt class="col-sm-4 card-text">Teacher:</dt>
                        <dd class="col-sm-8 card-text">{this.props.teacher_name}</dd>

                    </div>
                
                
                        <div class="col text-right mb-3">
                            <Button variant="primary" path={this.props.course_details_path} text="View details"/>
                        </div>
                    
                </div>
            </div>
        )
    }
}

export default CourseIcon