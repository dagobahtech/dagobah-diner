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

    constructor() {
        super();

        this.state = {
        	isOpen:false
		};

		((myThis)=> {
            myThis.socket.on("store status", function (isOpen) {
                myThis.setState({
                    isOpen:isOpen
                });
            	if (!isOpen) {
                    browserHistory.push("/")

                }
            });
        })(this);

        this.socket.emit("check open");
    }

	formatTime(time){
		if(time === null) return;
		let newTime = time;
		return (newTime.replace("T", " ").substring(0, 19));
	}

	componentDidMount() {
		this.props.removeAllItem();
	}
    render() {
		if(!this.state.isOpen) {
			return (<div></div>)
		} else {
            return (
				<div className="transition-item enter-up-exit-down">
					<div>
						<h1 id="orderConfirmation" className="center-align">Thank you for ordering</h1>
					</div>
					<div className="container-fluid">
						<div className="row">
							<div className="col-lg-6 col-md-6 mx-auto">
								<h2>Order #{this.props.processedOrder.id}</h2>
								<h5>Date: {this.formatTime(this.props.processedOrder.date)}</h5>
								<table className="table ">
									<thead className="thead-inverse">
									<tr>
										<th className="center-align">Item</th>
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
								<div className="right-align">
									<h5>{this.props.processedOrder.comboDiscount * 100}% Combo Discount:
										<div className="currency currency-black currency-large"></div>
										<NumberFormat value={this.props.processedOrder.subTotal - this.props.processedOrder.total}
													  decimalPrecision={2}
													  displayType={'text'} thousandSeparator={true}
										/>
									</h5>
								</div>
								<div className="right-align">
									<h3>Total: <div className="currency currency-black currency-large"></div>
										<NumberFormat value={this.props.processedOrder.total}
													  decimalPrecision={2}
													  displayType={'text'} thousandSeparator={true}
										/> </h3>
								</div>

								<div className="btn btn-success btn-lg center-block" style={{'cursor':'pointer'}} onClick={()=> { browserHistory.push("/"); this.props.removeAllItem()}}>Done</div>

							</div>
						</div>
					</div>

				</div>
            );
		}

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