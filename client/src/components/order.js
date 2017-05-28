import React, {Component} from 'react'
//these are the containers for this component
import OrderBoard from '../components/order-board';
import Banner from './banner';
import ConfirmationBox from '../components/confirmation-box';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import {removeAllItem} from '../actions/order/index';
import {bindActionCreators} from 'redux';
//import css
import '../css/order/menu.css'

const io = require("socket.io-client");

/**
 * Order layout/board. This is also a dumb class (class only made for layout)
 * */
class Order extends Component {
    //The CategoryNavigation tag only shows whatever is in the CategoryNavigation class
    //same with others

    constructor() {
        super();
        this.closeStore = this.closeStore.bind(this);
    }
    socket = io();

    componentDidMount() {
        this.socket.on("close store", this.closeStore);
    }

    closeStore() {
        this.socket.removeListener("close store", this.closeStore);
        this.props.removeAllItem();
        browserHistory.push("/")
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeAllItem: removeAllItem
    }, dispatch);

}

export default connect(null, mapDispatchToProps)(Order);
