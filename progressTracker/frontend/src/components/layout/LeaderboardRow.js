import React, { Component } from "react";

export class LeaderboardRow extends Component {
  render() {
    return (
      <tr>
        <th scope="row">{this.props.id}</th>
        <td>{this.props.name}</td>
        {this.props.grades.map( (grade) => {
          return <td key={grade["key"]}>{grade["value"]}</td>
        })}
        <td>{this.props.total}</td>
      </tr>
    );
  }
}

export default LeaderboardRow;