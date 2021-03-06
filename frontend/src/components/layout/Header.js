import React, {Component} from 'react'
import { Toaster } from 'react-hot-toast';
import Button from './Button'

export class Header extends Component{
  constructor(props){
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = () => {
    fetch("/api/auth/logout", {
      crossDomain: true,
      withCredentials: true,
      async: true,
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).catch((error) => {
      console.log(error);
    });
    localStorage.removeItem("token");
  };

  render(){
    return(
      <nav className="navbar navbar-expand-sm navbar-dark" id="nav">
        <img className="navbar-brand" src="../../static/images/logo.png" alt="logo"/>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0 mr-3">
            <li>
              <Button text={this.props.button1_text} path={this.props.button1_path} onClick={this.props.button1_handle}/>
            </li>
            <li>
              <Button text={this.props.button2_text} path={this.props.button2_path} onClick={this.props.is_logout ? this.handleLogout : this.props.button2_handle}/>
            </li>
          </ul>
        </div>
        <Toaster toastOptions={{duration:2000, style: {padding:"10px"}, success:{duration:2000}, error:{duration:2000}}}/>
      </nav>
    )
  }
}

export default Header