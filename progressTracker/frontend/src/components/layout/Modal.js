import React, {  Component } from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter } from 'reactstrap';
import Button from './Button';

export class ModalComponent extends Component {
    render() {
        return (
            <Modal isOpen={this.props.show} unmountOnClose={false}>
                <ModalHeader>{this.props.title}</ModalHeader>
                <ModalBody>
                {this.props.body}
                </ModalBody>
                <ModalFooter>  
                    <Button type="submit" onClick={this.props.handleSubmit} text="Save"/>
                    <Button type="submit" color="btn-rev" onClick={this.props.handleCancel} text="Cancel"/>
                </ModalFooter>
            </Modal>
        )
    }
}


export default ModalComponent
