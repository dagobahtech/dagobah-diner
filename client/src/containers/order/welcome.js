import React, {Component} from 'react'
import {Link} from 'react-router';
import '../../css/order/menu.css';
import '../../css/order/transition.css';

const io = require("socket.io-client");

class Welcome extends Component {

    constructor() {
        super();

        this.state = {
            isOpen: null
        };

        this.setStatus = this.setStatus.bind(this);
    }

    componentDidMount() {
        let socket = io();
        socket.on("store status", this.setStatus);
        socket.emit("check open");
    }

    setStatus(isOpen) {
        this.setState({isOpen: isOpen});
    }
    render() {

        let comp;

        if(this.state.isOpen === true) {
            comp = (<Link to="order" id="welcomeBut" className="welcome-bg-button">Click Here to Start Ordering</Link>);
        } else if(this.state.isOpen === false){
            comp =   (<div id="closedStuff">Hey! Sorry, we are currently closed right now. Come back again later.</div>);
        } else {
            comp = (<div></div>)
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