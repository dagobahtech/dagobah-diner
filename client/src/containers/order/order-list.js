import React, {Component} from 'react';
import OrderItem from './order-item';
import {connect} from 'react-redux';
import {removeAllItem, confirmAction, setOrderNumber} from '../../actions/order/index';
import {bindActionCreators} from 'redux';
import NumberFormat from 'react-number-format';
//import css
import '../../css/order/menu.css'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router';
/**
 * This components shows all the items that
 * the customer have ordered
 * */
class OrderList extends Component {


    constructor(props) {
        super(props);

        (function(myThis) {myThis.props.socket.on("orderinfo", function (id) {
            myThis.props.setOrderNumber(id);
            console.log("pushing processing");
            //browserHistory.push('processing-order');
        })})(this)
    }


    createOrderTable(){
        return (
            <div>
                <table className="table-striped" style={{'width':'500px'}}>
                    <thead className="thead-inverse">
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.orderedItems.items.map(function (item) {
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
                <div className="right-align"><h3>Total:
                    <div className="currency currency-black currency-large"></div>
                    <NumberFormat value={this.props.orderedItems.total}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                    />
                    </h3></div>
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
                this.props.socket.emit("send order", order);
                setTimeout(function() {browserHistory.push('processing-order')}, 100);
            });

        //this.props.changeView("processing");
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
                <div className="card-block">
                        <table className="table">
                            <thead className="container-fluid thead-inverse">
                                <tr className="row">
                                    <th className="col-md-1">&nbsp;</th>
                                    <th className="col-md-4">Item</th>
                                    <th className="col-md-1">Qty</th>
                                    <th className="col-md-2">Price</th>
                                    <th className="col-md-2">Subtotal</th>
                                    <th className="col-md-2">&nbsp;</th>
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
                    <div className="right-align">
                        <button className="btn btn-danger" onClick={() => this.requestRemove()}>Cancel Order</button>&nbsp;
                        <button className="btn btn-success" onClick={() => this.confirmOrder()}>Confirm Order</button>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        orderedItems: state.orderedItems, //now we can use this.props.orderedItems
        socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeAllItem: removeAllItem,
        confirmAction: confirmAction,
        setOrderNumber: setOrderNumber
    }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);