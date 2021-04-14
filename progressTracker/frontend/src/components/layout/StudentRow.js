import React, { Component } from 'react'
import {  } from 'reactstrap';

export class StudentRow extends Component { 
    render() {
        return (
                <tr>
                <th scope="row" >{this.props.id}</th>
                <td>{this.props.first_name}</td>
                <td>{this.props.last_name}</td>
                <td>{this.props.email}</td>
                <td>{this.props.index_nr}</td>
                </tr>  
        )
    }
}

export default StudentRow