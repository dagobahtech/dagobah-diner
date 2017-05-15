import React, {Component} from 'react'
import logo from '../css/order/images/logo.svg'

class Banner extends Component {
    
    render() {
        return (
            <div className="navbar navbar-default navbar-static-top">
                <div className="navbar-header">
                    <img className="logo-navbar navbar-brand" src={logo} alt="dagobah-logo"></img>
                </div>
            </div>
        );
    }
}

export default Banner;