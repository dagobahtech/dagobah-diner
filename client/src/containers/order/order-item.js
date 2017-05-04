import React, {Component} from 'react';
import {connect} from 'react-redux';
import {removeItem, selectItem} from '../../actions/order/index';
import {bindActionCreators} from 'redux';
/**
 * This component represents each item in the order
 * */

class OrderItem extends Component {


    render() {
        return (
            <tr>
                <td>{this.props.item.name}</td>
                <td>{this.props.item.quantity}</td>
                <td>{this.props.item.price}</td>
                <td>{this.props.item.quantity * this.props.item.price}</td>
                <td>
                    <button className="btn btn-warning btn-xs" onClick={()=>this.props.selectItem(this.props.item, false)}>View</button>
                    <button className="btn btn-danger btn-xs" onClick={()=>this.props.removeItem(this.props.index)}>&Chi;</button>
                </td>
            </tr>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeItem: removeItem,
        selectItem: selectItem
    }, dispatch);

}

export default connect(null, mapDispatchToProps)(OrderItem);