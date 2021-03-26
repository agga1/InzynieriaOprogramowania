import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Header from './layout/Header'

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loaded: false,
        placeholder: "Loading"
      };
    }
  
    componentDidMount() {
      fetch("api/mocks")
        .then(response => {
          if (response.status > 400) {
            return this.setState(() => {
              return { placeholder: "Something went wrong!" };
            });
          }
          return response.json();
        })
        .then(data => {
          this.setState(() => {
            return {
              data,
              loaded: true
            };
          });
        });
    }
  
    render() {
      return (
          <div>
              <Header/>
              <h2>Mocks:</h2>
            <ul>
          {this.state.data.map(mock => {
            return (
              <li key={mock.id}>
                {mock.name}, {mock.id}
              </li>
            );
          })}
        </ul>
          </div>
      );
    }
  }
ReactDOM.render(<App/>, document.getElementById('app'));