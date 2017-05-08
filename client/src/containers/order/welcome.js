import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';

class Welcome extends Component {

    render() {
        return (
            <div className="welcome-bg transition-item welcome-page">

                <div className="text-center TWords">Restaurant Name</div>
                <Link to="/order" className="btn btn-success centerButt center-block">Start Ordering Now</Link>
            </div>
        );
    }
}

export default Welcome;