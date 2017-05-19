import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';
import logo from '../../css/order/images/logo.svg';

class Welcome extends Component {

    render() {
        return (

                <div className="flx-embed welcome-bg-outer transition-item enter-down-exit-up" >
                    <div className="welcome-bg-banner">
                        Dagobah <span style={{'color':'orange'}}>Diner</span> <br />
                        <div className="sub">We bet you won’t find better</div>
                    </div>
                    <div className="welcome-bg-button-span">
                        <Link to="order" className="welcome-bg-button">Click Here to Start Ordering</Link>
                    </div>
                    <div className="welcome-bg-cover"></div>
                    <div className="welcome-bg-container">
                        <iframe className="welcome-bg" src="https://media.flixel.com/cinemagraph/prnarfpf3ar3aewyydky?hd=false" frameborder="0" allowfullscreen></iframe>

                    </div>
                </div>

        );
    }
}

export default Welcome;