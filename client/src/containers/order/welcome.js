import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';

class Welcome extends Component {

    render() {
        return (
            <div className="welcome-bg transition-item enter-down-exit-up">
                <div className="TWords">Restaurant Name</div>
                <Link to="choice" className="btn btn-success">Start Ordering Now</Link>
            </div>
        );
    }
}

export default Welcome;