import React, {Component} from 'react'
//these are the containers for this component
import OrderBoard from '../components/order-board';
import Banner from './banner';
import ConfirmationBox from '../components/confirmation-box';
import { browserHistory } from 'react-router';

//import css
import '../css/order/menu.css'

const io = require("socket.io-client");
/**
 * Order layout/board. This is also a dumb class (class only made for layout)
 * */
class Order extends Component {
    //The CategoryNavigation tag only shows whatever is in the CategoryNavigation class
    //same with others

    socket = io();

    constructor() {
        super();

        this.state = {
            isOpen: false
        };

        ((myThis)=>
        {
            myThis.socket.on("store status", function (isOpen) {
                myThis.setState({isOpen:isOpen});

                if (!isOpen) {
                    browserHistory.push("/")
                }
            });
        })(this);

        this.socket.emit("check open");
    }

    render() {


        return (

            <div className="container-fluid transition-item enter-up-exit-down main">
                <ConfirmationBox/>
                <Banner/>
                <div className="container-fluid">
                    <OrderBoard/>
                </div>
            </div>

        )


    }
}

export default Order;