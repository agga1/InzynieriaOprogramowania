import React, {  Component } from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter } from 'reactstrap';
import Button from './Button';

export class CustomModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.show} unmountOnClose={false}>
                <ModalHeader>{this.props.title}</ModalHeader>
                <ModalBody>{this.props.body}</ModalBody>
                <ModalFooter>  
                    <Button type="submit" onClick={this.props.handleSubmit} text="Yes"/>
                    <Button type="submit" className="btn-rev" onClick={this.props.handleCancel} text="No"/>
                </ModalFooter>
            </Modal>
        )
    }
}

export default CustomModal

