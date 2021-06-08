import React from 'react'
import { Component } from 'react';
import AddStudentsModal from './modals/AddStudentsModal';

export class AddStudentsComponent extends Component{
    constructor(props){
        super(props);

        this.state={
            chosenStudents: [],
            isStudent: localStorage.getItem('isStudent'),
        }
        this.handleStudents = this.handleStudents.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleAddCancel = this.handleAddCancel.bind(this);
    }

    handleAddSubmit = (e) => {
        e.preventDefault();
        fetch(localStorage.getItem('courseUrl')+'add_students/', {
          method : 'POST',
          headers : {
            Authorization : `Token ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json',
          },
          body : JSON.stringify(this.prepareData())
        })
          .then(res => res.json())
          .then( () =>{
              this.props.refresh();
              this.handleAddCancel();
            }
          )
          .catch(err => console.log(err));
      }
    
      handleAddCancel = () => {
        this.setState({
          chosenStudents: [],
        });
        this.props.toggleAdd();
      }
    
      handleStudents = (e) => {
        this.setState({chosenStudents: e});
      }
    
      prepareData(){
        var students_id = this.state.chosenStudents;
        students_id = students_id.map(e => e.value);
        return{
          students: students_id,
        }
      }

      render(){
          return(
            <AddStudentsModal
            show={this.props.showAdd}
            chosenStudents = {this.state.chosenStudents}
            handleStudents = {this.handleStudents}
            handleSubmit = {this.handleAddSubmit}
            handleCancel = {this.handleAddCancel}
          />
          );
      }
}

export default AddStudentsComponent