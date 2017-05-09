import React, {Component} from 'react'
import logo from '../css/order/images/logo.svg';

class Banner extends Component {
    
    render() {
        return (
            <div className="banner">
                <img src={logo} alt="" className="banner"/>
            </div>
        );
    }
}

export default Banner;