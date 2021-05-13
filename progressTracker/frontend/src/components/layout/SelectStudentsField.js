import React, { Component } from 'react'
import Select from 'react-select'
import { getElement } from '../functions/helpers';

export class SelectStudentsField extends Component { 
    constructor(props) {
		super(props)

        this.state = {
             students: [],
		}
	}

    componentDidMount(){
        this.getStudents();
    }

    getStudents(){
        getElement('/api/students')
        .then(resp => {
            this.prepareStudents(resp);
        })
        .catch(err => console.log(err)); 
    }


    prepareStudents(students){
        let tab = [];
        let student;
        for(student in students){
            tab.push({
                value: students[student].user.id,
                label: students[student].user.first_name +" "+ students[student].user.last_name+"; ["+students[student].user.email+"]"
            })
        }

        this.setState({
            students : tab,
        });
    }

    render() {
        return (
            <Select 
                classNamePrefix="input_window "
                isMulti = {true}
                value = {this.props.chosen_students}
                onChange={this.props.handleStudents}
                options={this.state.students}
            />
        )
    }
}
export default SelectStudentsField