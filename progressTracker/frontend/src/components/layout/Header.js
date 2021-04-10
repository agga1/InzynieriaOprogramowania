import React, {Component} from 'react'
import Button from './Button'

export class Header extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <nav className="navbar navbar-expand-sm navbar-light" id="nav">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <img src="../../static/images/logo.png" alt="logo"/>
                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li>
                            <Button text={this.props.button1_text}/>
                        </li>
                        <li>
                            <Button text={this.props.button2_text}/>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Header