import React, {Component} from 'react';
import OrderItem from './order-item';
import {connect} from 'react-redux';
import {removeAllItem, confirmAction, setOrderNumber, setProcessedOrder, setConstraints} from '../../actions/order/index';
import {bindActionCreators} from 'redux';
import NumberFormat from 'react-number-format';

//import css
import '../../css/order/menu.css'

//import sockets
const io = require("socket.io-client");

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router';
/**
 * This components shows all the items that
 * the customer have ordered
 * */
class OrderList extends Component {

    socket = io();

    constructor() {
        super();
        this._updateOrderNumber = this._updateOrderNumber.bind(this);
        this._handleErrorMessage = this._handleErrorMessage.bind(this);
        this._setProcessedOrder = this._setProcessedOrder.bind(this);
        this._setConstraints = this._setConstraints.bind(this);
        //container for functions coming from the server
        this.state = {
            processedOrder: null
        }
    }


    componentDidMount() {
        this.socket.on("orderinfo", this._updateOrderNumber);
        this.socket.on("ordererror", this._handleErrorMessage);
        this.socket.on("processed order", this._setProcessedOrder);
        this.socket.on("send constraints", this._setConstraints);
        this.socket.emit("get constraints");
    }

    _setConstraints(maxItemPerOrder, maxQuantityPerItem) {
        this.props.setConstraints(maxItemPerOrder, maxQuantityPerItem);
    }

    _setProcessedOrder(order) {
        this.setState({
            processedOrder: order
        });
        this.props.setProcessedOrder(order);

        this.confirmOrder();

    }
    _handleErrorMessage(message) {
        this.props.confirmAction("Something went wrong", message,<div/>, null);
    }
    _updateOrderNumber(order) {
        this.props.setProcessedOrder(order);
        console.log("pushing processing", order.id);
        browserHistory.push('processing-order');
    }

    createOrderTable(){
        return (
            <div id="confirmList">
                <table className="table-striped">
                    <thead className="thead-inverse">
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.processedOrder.items.map(function (item) {
                        return (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <div className="currency currency-black currency-small"></div>
                                    <NumberFormat value={item.price}
                                                  decimalPrecision={2}
                                                  displayType={'text'} thousandSeparator={true}
                                    />
                                    </td>
                                <td>
                                    <div className="currency currency-black currency-small"></div>
                                    <NumberFormat value={item.price * item.quantity}
                                                  decimalPrecision={2}
                                                  displayType={'text'} thousandSeparator={true}
                                    />
                                    </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <hr/>

                <div className="right-align"><h5>SubTotal:
                    <div className="currency currency-black currency-large"></div>
                    <NumberFormat value={this.state.processedOrder.subTotal}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                    />
                    </h5>
                </div>
                <div className="right-align">
                    <h5>{this.state.processedOrder.comboDiscount * 100}% Combo Discount:
                        <div className="currency currency-black currency-large"></div>
                        <NumberFormat value={this.state.processedOrder.subTotal - this.state.processedOrder.total}
                                      decimalPrecision={2}
                                      displayType={'text'} thousandSeparator={true}
                        />
                    </h5>
                </div>
                <div className="right-align">
                    <h3>Total: <div className="currency currency-black currency-large"></div>
                        <NumberFormat value={this.state.processedOrder.total}
                                      decimalPrecision={2}
                                      displayType={'text'} thousandSeparator={true}
                        /> </h3>
                </div>
            </div>
        )
    }

    //TODO need to implement this
    confirmOrder() {

        let comp = this.createOrderTable();
        (this.props.orderedItems.items.length !== 0) &&
        this.props.confirmAction("Your order", "Are you ok with this order?", comp,
            ()=> {
                console.log("Order has been submitted");
                const order = {
                    //id: 0, //should be taken from the server,
                    items: this.props.orderedItems.items,
                    total: this.props.orderedItems.total
                };
                //console.log(order);
                this.socket.emit("send order", order);
                //browserHistory.push('processing-order')

            });


        //this.props.changeView("processing");
    }

    verifyOrder() {
        (this.props.orderedItems.items.length !== 0) &&
        this.socket.emit("verify order", this.props.orderedItems);
    }
    requestRemove() {

        //browserHistory.push("/");
        this.props.confirmAction("Cancel order",
            "Are you sure you want to cancel this order? No more yum yum?", <div></div>,
            ()=> {this.props.removeAllItem(); setTimeout(browserHistory.push, 100, "/");});
    }

    render() {
        console.log(this.props.orderedItems.items);
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Total : <div className="currency currency-black currency-large"></div>
                        <NumberFormat value={this.props.orderedItems.total}
                                              decimalPrecision={2}
                                              displayType={'text'} thousandSeparator={true}
                                              /></h2>
                </div>
                <div className="card-block" id="cardOuter">
                        <table className="table">
                            <thead className="container-fluid thead-inverse">
                                <tr className="row" id="listOuter">
                                    <th id="tablePad">&nbsp;</th>
                                    <th id="tableItem">Item</th>
                                    <th id="tableQty">Qty</th>
                                    <th id="tablePrice">Price</th>
                                    <th id="tablePad">Sub total</th>
                                </tr>
                            </thead>

                            <ReactCSSTransitionGroup component="tbody" transitionName="order" className="container-fluid" 
                                                     transitionEnterTimeout={300}
                                                     transitionLeaveTimeout={300}>
                                {
                                    this.props.orderedItems.items.map(function (item, index) {
                                        return (<OrderItem item={item} key={item.id} index={index}/>)
                                    }, this)
                                }
                            </ReactCSSTransitionGroup>

                        </table>
                    <div className="right-align" id="orderListButtons">
                        <button className="btn btn-danger" onClick={() => this.requestRemove()} id="cancelButton">Cancel Order</button>&nbsp;
                        <button className="btn btn-success" onClick={() => this.verifyOrder()} id="confirmButton">Confirm Order</button>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        orderedItems: state.orderedItems //now we can use this.props.orderedItems

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeAllItem: removeAllItem,
        confirmAction: confirmAction,
        setOrderNumber: setOrderNumber,
        setProcessedOrder: setProcessedOrder,
        setConstraints: setConstraints
    }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);