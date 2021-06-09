import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Footer from '../layout/Footer';
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar';
import Spinner from '../layout/Spinner';
import { getElement } from '../functions/helpers'
import Chart from "react-google-charts";
import toast from 'react-hot-toast';

export class Histogram extends Component {
  constructor(props) {
    super(props)

    this.state = {
      taskName: '',
      taskGradeMax: '',
      taskGradeMin: '',
      grades: [],
      myGrade: '',
      grades_loaded: false,
      loaded: false,
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      getElement(localStorage.getItem('taskUrl')).then((data) => {
        this.setState(() => ({
          taskID: data.id,
          taskName: data.name,
          taskGradeMax: data.grade_max,
          taskGradeMin: data.grade_min,
          loaded: true
        }))
      })
        .catch((err) =>{
          toast.error("Error occured while getting task. Try to refresh the page.");
        })
      getElement(localStorage.getItem("taskUrl") + "grades").then((data) => {
        let grades_list = [];
        grades_list.push(["Student", "Grade"]);
        
        if(localStorage.getItem("isStudent") == "false"){
            data.grades.map((grade) =>{
                grades_list.push([grade.student_name, grade.value]);
            })
        }else{
            data.grades.map((grade) =>{
                if(grade.student == localStorage.getItem("studentId")){
                    grades_list.push(["My Result", grade.value]);
                    this.setState(() => ({
                        myGrade : grade.value
                      }))
                }
                else
                    grades_list.push(["", grade.value]);
            })
        }
        this.setState( () => ({
        grades: grades_list,
        grades_loaded: true
        }))
      })
    }
    else {
      toast.error('Log into to see the view',{duration:6000});
      window.location.href = "/";
    }
  }

  prepareView() {
    var number = 0
    var quantity = this.state.taskGradeMax - this.state.taskGradeMin;
    if(quantity<=20) number = 1;
    else if(quantity<=50) number = 2;
    else if(quantity<=100) number = 5;
    else number = 10;
    if (!this.state.loaded || !this.state.grades_loaded) {
      return (
        <Col md={10} className="mb-5 mt-5">
          <Spinner className="spinner"/>
        </Col>
      );
    } else {
      if(this.state.grades.length === 1){
          return <h1 className="heading">No grade was assigned to this task.</h1>
      }
      else{
        return (
            <Chart
                width={'1000px'}
                height={'600px'}
                chartType="Histogram"
                loader={<div>Loading Chart</div>}
                data={this.state.grades}
                options={{
                    legend: { position: 'none' },
                    colors: ['#ff8c42'],
                    bar: { gap: 0 },
                    histogram: {
                        bucketSize: number,
                        minValue: this.state.taskGradeMin,
                        maxValue: this.state.taskGradeMax-number
                    },
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        );}
    }
  }

  returnPoints(){
      if(localStorage.getItem("isStudent") == "false")
        return this.state.taskGradeMax;
      else
        return this.state.myGrade + "/" + this.state.taskGradeMax;
  }

  render() {
    return (
      <Fragment>
        <Header button1_text="My Courses" button2_text="Log Out" button1_path="/student/courses" button2_path="/" is_logout={true} />
        <Container fluid>
          <Row className="mt-4 mb-3 ml-3">
            <Col md={2} />
            <Col md={7} className="task-heading title text-left">{this.state.taskName}</Col>
            <Col md={3} className="task-heading login_heading text-right pr-5" style={{ "fontSize": "40px" }}>{this.returnPoints()}</Col>
          </Row>
          <Row>
            <Col md={2} className="ml-md-0 pl-md-0">
              <Sidebar />
            </Col>
            <Col md={10}>
            {this.prepareView()}
            </Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    )
  }
}

export default Histogram
