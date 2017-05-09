import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/order/order-process.css';
import {orderedItems} from '../reducers/order/index';

class OrderProcessing extends Component {
    
    render() {

        return (
        	<div>
	            
	            <table className="in-progress container">
	            	<tr className="row">
	            		<td className="col-lg-6 col-md-6 col-sm-6 order-number">Your order number is:</td>
	            		<td className="col-lg-6 col-md-6 col-sm-6 order-number">1234</td>
	            		
	            	</tr>
	            	<tr className="row">
		            	<th className="col-lg-3 col-md-3 col-sm-3 order-name">Item</th>
		            	<th className="col-lg-3 col-md-3 col-sm-3 order-name">Quantity</th>
		            	<th className="col-lg-3 col-md-3 col-sm-3 order-name">Price</th>
		            	<th className="col-lg-3 col-md-3 col-sm-3 order-name">Sub Total</th>
	            	</tr>
	      			{this.props.orderedItems.items.map(function(item){
	      				return(<tr className="row">
	      					<td className="col-lg-3 col-md-3 col-sm-3 order-item">{item.name}</td>
	      					<td className="col-lg-3 col-md-3 col-sm-3 order-item">x{item.quantity}</td>
	      					<td className="col-lg-3 col-md-3 col-sm-3 order-item">{item.price}</td>
	      					<td className="col-lg-3 col-md-3 col-sm-3 order-item">{item.quantity*item.price}</td>
	      					</tr>)
	      			})}
	      			<tr className="row">
	      				<td className="col-lg-3 col-md-3 col-sm-3 order-item">Total:</td>
	      				<td className="col-lg-3 col-md-3 col-sm-3"></td>
	      				<td className="col-lg-3 col-md-3 col-sm-3"></td>
	      				<td className="col-lg-3 col-md-3 col-sm-3 order-item">{this.props.orderedItems.total}</td>
	      			</tr>
	            </table>
	            
            </div>
        );
    }
}

function mapStateToProps(state) {
	return {
		orderedItems: state.orderedItems
	};
}

export default connect(mapStateToProps)(OrderProcessing);