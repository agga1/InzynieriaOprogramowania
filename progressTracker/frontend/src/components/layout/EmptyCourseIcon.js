import React, { Component } from 'react'
import { Card, CardBody, CardText, CardTitle, Col } from 'reactstrap';
import Button from './Button'

export class EmptyCourseIcon extends Component {
    render() {
        return (
            <div>
                <Card className="icon">
                    <CardBody>
                        <CardTitle tag="h1">Add new course</CardTitle>
                            <a href={this.props.path}>
                                <div class="empty-icon" >
                                    <img src="../../static/images/add_icon.png" className="card-img-top add-icon" alt="add course icon"/>
                                </div>
                            </a>                         
                    </CardBody>
                </Card>
            </div>
        )
    }
}


export default EmptyCourseIcon