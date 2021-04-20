import React, { Component, Fragment } from "react";
import { Card, CardBody, Row, CardTitle, Col, List, ListInlineItem } from 'reactstrap';
import Button from './Button'

export class TaskIcon extends Component { 
    constructor(props) {
        super(props);
    
        this.state = {
          style: '',  
          show: false,
          children: []
        };
        // this.show = this.show.bind(this);
        this.onClick = this.onClick.bind(this);
        this.showChildren = this.showChildren.bind(this);
      }


    onClick=() =>{
        this.setState((state) => ({
            show: !state.show,
            style: "clicked"
        }))
        console.log(this.state.show);
        if(this.state.show==true){
            this.getChildren();
        }
    }

    showChildren=() =>{
        console.log(this.state.children.length==0)
        if(this.state.show && this.state.children.length!=0){
            return(
                <Row className="p-2">
                    <Col xs={1}></Col>
                    <Col xs={11}>
                    {this.state.children.map((task) =>{
                        console.log(task);
                        return (
                            <Col
                            xs={12}
                            key={task.name + task.deadline}
                            className="mb-4"
                            >
                            <TaskIcon
                                task_name={task.name}
                                deadline={task.deadline}
                                // url={task.url}
                                // onClick = {this.onClick()}
                                max_points="/50"
                            />
                            </Col>
                        );

                    })}
                    </Col>
                </Row>
            );
        }else{
            return(<div></div>)
        }
    }

    getChildren(){
        fetch(this.props.url + "children", {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => {
              if (response.status > 400) {
                return this.setState(() => {
                  return { placeholder: "Something went wrong!" };
                });
              }
              return response.json();
            })
            .then((data) => {
              this.setState(() => {
                return {
                  children: data.children,
                };
              });
            });
    }


    
    
    render() {
        return (
            <Fragment>
            <a className="stretched-link" onClick={this.onClick}>
                <Card className={`icon ${ this.state.style }`} >
                    <Row >
                        <Col xs={11}>
                        <CardBody className="pb-0">
                            <CardTitle tag="h1">{this.props.task_name}</CardTitle>
                        </CardBody>
                        </Col>
                        <Col xs={1} className="pt-3" >
                            <h1>{this.props.max_points}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <CardBody className="pt-0">
                                <List >
                                    <ListInlineItem className="card-text"><b>Deadline:</b></ListInlineItem>
                                    <ListInlineItem className="card-text">{this.props.deadline}</ListInlineItem>
                                </List>
                            </CardBody>
                        </Col>
                        

                        <Col xs={6} className="text-right task-btn">
                            <List >
                                <ListInlineItem href="#" className="task-link pr-3">+Task</ListInlineItem>
                                <ListInlineItem href="#"  className="task-link pr-3 ">Rate</ListInlineItem>
                                <ListInlineItem href="#"  className="task-link">Details</ListInlineItem>
                            </List>
                        </Col>
                    </Row>
                </Card>
            </a>
            <div>
            {this.showChildren()}
            </div>
        </Fragment>
        )
    }
}

export default TaskIcon