import React, { Component } from 'react';
import {Alert } from 'reactstrap';

export class AlertComponent extends Component {
    render() {
        // if(this.props.show==1){
            return(
                console.log(this.props.color),
            <Alert  isOpen={this.props.show} onClose={this.props.onDismiss} color={this.props.color}>
                {this.props.text}
               
            </Alert >)
            
        // }else{
        //     return('');
        // }
    }
}

export default AlertComponent

