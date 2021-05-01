import React, { Component } from "react";

export class LeaderboardRow extends Component {
  render() {
    console.log(this.props.grades);
    return (
      <tr>
        <th scope="row">{this.props.id}</th>
        <td>{this.props.name}</td>
        <td>{this.props.grades}</td>
        {/* {this.props.grades.map( (grade) => {
          return <td>{grade}</td>
        })} */}
        <td>{this.props.total}</td>
      </tr>
    );
  }
}

export default LeaderboardRow;