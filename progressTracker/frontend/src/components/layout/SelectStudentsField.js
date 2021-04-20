import React, { Component } from 'react'
import Select from 'react-select'

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
        fetch('/api/students', {
            method : 'GET',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(resp => {
            this.setState({
                students : this.prepareStudents(resp)
            });    
        })
        .catch(err => console.log(err)); 
    }


    prepareStudents(students){
        var tab = [];
        var student;
        for(student in students){
            tab.push({
                value: students[student].user.id,
                label: students[student].user.first_name + students[student].user.last_name+"; ["+students[student].user.email+"]"
            })
        }
        return tab
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