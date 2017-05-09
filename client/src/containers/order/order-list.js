import React, {Component} from 'react';
import OrderItem from './order-item';
import {connect} from 'react-redux';
import {removeAllItem, confirmAction} from '../../actions/order/index';
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


    createOrderTable(){
        return (
            <div>
                <table className="table-striped">
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td>Quantity</td>
                        <td>Price</td>
                        <td>Subtotal</td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.orderedItems.items.map(function (item) {
                        return (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.price * item.quantity}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="right-align"><h3>Total: {this.props.orderedItems.total}</h3></div>
            </div>
        )
    }
    //TODO need to implement this
    confirmOrder() {
        let comp = this.createOrderTable();

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
            })

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
                    <h2>Total : <NumberFormat value={this.props.orderedItems.total}
                                              decimalPrecision={2}
                                              displayType={'text'} thousandSeparator={true}
                                              suffix={' IC'}/></h2>
                </div>
                <div className="card-block">
                        <table className="table">
                            <thead className="container-fluid thead-inverse">
                                <tr className="row">
                                    <th className="col-md-1"></th>
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
                </div>
                <div className="panel-footer right-align">
                    <button className="btn btn-danger" onClick={() => this.requestRemove()}>Cancel Order</button>&nbsp;
                    <button className="btn btn-info" onClick={() => this.confirmOrder()}>Confirm Order</button>
                </div>
                <div className="card-footer">
                    This order is {this.props.orderedItems.type}
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
        confirmAction: confirmAction
    }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);