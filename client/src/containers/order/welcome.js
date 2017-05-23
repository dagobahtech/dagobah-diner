import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';

const io = require("socket.io-client");

class Welcome extends Component {

    socket = io();

    constructor() {
        super();
        this.state = {
            isOpen: false
        };

        ((myThis) => {myThis.socket.on("store status", function (isOpen) {
            myThis.setState({
                isOpen: isOpen
            });
        });})(this);

        this.socket.emit("check open");
    }
    render() {

        let comp;

        if(this.state.isOpen) {
            comp = (<Link to="order" id="welcomeBut" className="welcome-bg-button">Click Here to Start Ordering</Link>);
        } else {
            comp =   (<div id="closedStuff">Hey! Sorry, we are currently closed right now. Come back again later.</div>);
        }
        return (

                <div className="flx-embed welcome-bg-outer transition-item enter-down-exit-up">
                    <video id="bg-video" autoPlay loop preload playsInline>
                        <source src="https://flixels.s3.amazonaws.com/flixel/prnarfpf3ar3aewyydky.tablet.mp4?v=1" type="video/mp4"/></video>
                    <div className="welcome-bg-banner">
                        Dagobah <span style={{'color':'orange'}}>Diner</span> <br />
                        <div className="sub">We bet you won’t find better</div>
                    </div>
                    <div className="welcome-bg-button-span">
                        {comp}
                    </div>
                </div>

        );
    }
}

export default Welcome;