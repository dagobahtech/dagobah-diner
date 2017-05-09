import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';
import logo from '../../css/order/images/logo.svg';

class Welcome extends Component {

    render() {
        return (
            <div className="transition-item enter-down-exit-up">
                <div className="container">
                    <div className="row">
                        <img src={logo} alt="" className="logo"/>
                    </div>
                    <div className="row">
                        <div className="TWords text-center">Restaurant Name</div>
                    </div>
                    <div className="row">
                        <Link to="/choice"
                              className="btn btn-success col-lg-4 offset-lg-4 centerButt">
                            Click here to start Ordering
                        </Link>
                    </div>
                </div>



            </div>
        );
    }
}

export default Welcome;