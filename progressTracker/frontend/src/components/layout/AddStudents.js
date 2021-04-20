import React, {  Component, Fragment } from 'react'
import { Modal,ModalHeader,ModalBody,ModalFooter } from 'reactstrap';
import AddCourseForm from './AddCourseForm'
import Button from './Button';
import Select from 'react-select'

export class AddStudents extends Component {
    render() {
        return (
            <Modal isOpen={this.props.show} unmountOnClose={false}>
                <ModalHeader >Add students</ModalHeader>
                <ModalBody>
                    <Select 
                    classNamePrefix="input_window "
                    isMulti = {true}
                    value = {this.props.chosen_students}
                    onChange={this.props.handleStudents}
                    options={this.props.students}
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
