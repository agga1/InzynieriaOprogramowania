import React, {Component} from 'react'
import Button from './Button'

export class Footer extends Component{
    render(){
        return(
            <nav className="navbar navbar-expand-sm navbar-light mt-5" id="nav">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <img src="../../static/images/logo.png" alt="logo"/>
                </div>
            </nav>
        )
    }
}

export default Footer