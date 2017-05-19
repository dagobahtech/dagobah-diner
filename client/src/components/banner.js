import React, {Component} from 'react'
import logo from '../css/order/images/logo.svg'
import '../css/order/menu.css'

class Banner extends Component {
    
    render() {
        return (
            <div className="navbar navbar-default navbar-static-top">
                <div className="navbar-header">
                    <div className="banner">Dagobah <span style={{'color':'orange'}}>Diner</span></div>
                    <div className="sub">We bet you won’t find better</div>
                </div>
            </div>
        );
    }
}

export default Banner;