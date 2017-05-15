import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/order/order-process.css';
import NumberFormat from 'react-number-format';
import {browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import {removeAllItem} from '../actions/order/index';

class OrderProcessing extends Component {

    render() {

        return (
			<div className="transition-item enter-up-exit-down">
				<div>
					<h1 className="center-align">Thank you for ordering</h1>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-6 col-md-6 mx-auto">
							<h2>Order #{this.props.orderedItems.id}</h2>
							<h5>Date: Date Placeholder</h5>
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
                                {this.props.orderedItems.items.map(function(item){
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
							<div className="right-align">
								<h4>Total:<div className="currency currency-black currency-large"></div>
									<NumberFormat value={this.props.orderedItems.total}
												  decimalPrecision={2}
												  displayType={'text'} thousandSeparator={true}
									/></h4>
							</div>
							<div className="btn btn-success btn-lg center-block" style={{'cursor':'pointer'}} onClick={()=> { browserHistory.push("/"); this.props.removeAllItem()}}>Done</div>

						</div>
					</div>
				</div>

			</div>
        );
    }
}

function mapStateToProps(state) {
	return {
		orderedItems: state.orderedItems,
        socket: state.socket
	};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeAllItem: removeAllItem
    }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(OrderProcessing);