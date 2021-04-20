import React, {  Component, Fragment } from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter } from 'reactstrap';
import Button from './Button';
import SelectStudentsField from './SelectStudentsField'

export class AddStudents extends Component {
    render() {
        return (
            <Modal isOpen={this.props.show} unmountOnClose={false}>
                <ModalHeader >Add students</ModalHeader>
                <ModalBody>
                <SelectStudentsField 
                    chosen_students = {this.props.chosen_students}
                    handleStudents={this.props.handleStudents}
                    />
                </ModalBody>
                <ModalFooter>  
                    <Button type="submit" onClick={this.props.handleSubmit} text="Save"/>
                    <Button type="submit" color="btn-rev" onClick={this.props.handleCancel} text="Cancel"/>
                </ModalFooter>
            </Modal>
        )
    }
}

export default AddStudents
