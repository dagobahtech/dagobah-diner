import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/order/order-process.css';
import NumberFormat from 'react-number-format';
import {browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import {removeAllItem} from '../actions/order/index';
const io = require("socket.io-client");

class OrderProcessing extends Component {

    socket = io();

    formatTime(time){
		if(time === undefined) return;
		let newTime = time;
		return (newTime.replace("T", " ").substring(0, 19));
	}

	componentDidMount() {
		this.props.removeAllItem();
	}
    render() {

        let comp = (<div></div>);

        if(this.props.processedOrder.subTotal !== this.props.processedOrder.total) {
            comp = (<div className="right-align">
                <h5>{this.props.processedOrder.comboDiscount * 100}% Combo Discount:
                    <div className="currency currency-black currency-large"></div>
                    <NumberFormat value={this.props.processedOrder.subTotal - this.props.processedOrder.total}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                    />
                </h5>
            </div>)
        }
        return (
            <div className="transition-item enter-up-exit-down">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-10 offset-sm-1">
                            <div className="card my-auto">
                                <h2 id="orderConfirmation" className="card-header center-align">Thank You for Ordering</h2>
                                <div className="card-block">
                                    <h2 className="card-title">Order #{this.props.processedOrder.id}</h2>
                                    <h5 className="card-subtitle">Date: {this.formatTime(this.props.processedOrder.date)}</h5>
                                    <table className="table">
                                        <thead className="thead-inverse">
                                            <tr>
                                                <th className="left-align">Item</th>
                                                <th className="center-align">Quantity</th>
                                                <th className="center-align">Price</th>
                                                <th className="center-align">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.processedOrder.items.map(function(item){
                                            return(<tr>
                                                <td>{item.name}</td>
                                                <td className="center-align">x{item.quantity}</td>
                                                <td className="center-align"><div className="currency currency-black currency-small"></div>
                                                    <NumberFormat value={item.price}
                                                                  decimalPrecision={2}
                                                                  displayType={'text'} thousandSeparator={true}
                                                    />
                                                </td>
                                                <td className="center-align"><div className="currency currency-black currency-small"></div>
                                                    <NumberFormat value={item.price * item.quantity}
                                                                  decimalPrecision={2}
                                                                  displayType={'text'} thousandSeparator={true}
                                                    />
                                                </td>
                                            </tr>)
                                        })}
                                        </tbody>
                                    </table>
                                    <div className="right-align"><h5>SubTotal:
                                        <div className="currency currency-black currency-large"></div>
                                        <NumberFormat value={this.props.processedOrder.subTotal}
                                                      decimalPrecision={2}
                                                      displayType={'text'} thousandSeparator={true}
                                        />
                                    </h5>
                                    </div>
                                    {comp}
                                    <div className="right-align">
                                        <h3>Total: <div className="currency currency-black currency-large"></div>
                                            <NumberFormat value={this.props.processedOrder.total}
                                                          decimalPrecision={2}
                                                          displayType={'text'} thousandSeparator={true}
                                            /> </h3>
                                    </div>
                                </div>
                                <div className="card-footer right-align">
                                    <a className="btn btn-secondary mr-2" href="/orderview">Orderview</a>
                                    <button className="btn btn-success" onClick={()=> { browserHistory.push("/"); this.props.removeAllItem()}}>New Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

function mapStateToProps(state) {
	return {
        processedOrder: state.processedOrder
	};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeAllItem: removeAllItem
    }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(OrderProcessing);