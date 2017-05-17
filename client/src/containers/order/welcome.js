import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';
import logo from '../../css/order/images/logo.svg';

class Welcome extends Component {

    render() {
        return (
            <div className="welcome-bg transition-item enter-down-exit-up">
                <div className="welcome-bg-filter">&nbsp;</div>
                <div className="container">
                    <div className="row">
                        <img src={logo} alt="" className="logo"/>
                    </div>
                    <div className="row" id="startOuter">
                        <Link to="/order"
							id="startBut">
                            CLICK HERE TO START ORDERING
                        </Link>
                    </div>
                </div>



            </div>
        );
    }
}

export default Welcome;