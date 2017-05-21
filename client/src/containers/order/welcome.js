import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';

class Welcome extends Component {

    render() {
        return (

                <div className="flx-embed welcome-bg-outer transition-item enter-down-exit-up">
                    <video id="bg-video" autoPlay loop preload playsInline>
                        <source src="https://flixels.s3.amazonaws.com/flixel/prnarfpf3ar3aewyydky.tablet.mp4?v=1" type="video/mp4"/></video>
                    <div className="welcome-bg-banner">
                        Dagobah <span style={{'color':'orange'}}>Diner</span> <br />
                        <div className="sub">We bet you won’t find better</div>
                    </div>
                    <div className="welcome-bg-button-span">
                        <Link to="order" id="welcomeBut" className="welcome-bg-button">Click Here to Start Ordering</Link>
                        <div id="closedStuff">We are sorry, but we are closed. Please try again later!</div>
                    </div>
                </div>

        );
    }
}

export default Welcome;