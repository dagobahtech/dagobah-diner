import React, {Component} from 'react';
import {connect} from 'react-redux';
import {removeItem, selectItem, confirmAction} from '../../actions/order/index';
import {bindActionCreators} from 'redux';
import NumberFormat from 'react-number-format';
import MenuItem from '../../containers/order/menu-item';

/**
 * This component represents each item in the order
 * */

class OrderItem extends Component {

    removeItem(index) {
        this.props.confirmAction("Cancel Item",
            "Are you sure you want to cancel this delicious item?",
            <MenuItem item={this.props.item} isClickable={false}/>,
            () => this.props.removeItem(index));
    }

    render() {
        return (
            <tr>
                <td>{this.props.item.name}</td>
                <td>{this.props.item.quantity}</td>
                <td>
                    <NumberFormat value={this.props.item.price}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                                  suffix={' IC'}
                                  />
                    </td>
                <td>
                    <NumberFormat value={this.props.item.quantity * this.props.item.price}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                                  suffix={' IC'}
                    /></td>
                <td>
                    <button className="btn btn-warning btn-xs"
                            onClick={()=>this.props.selectItem(this.props.item, false)}>View</button>
                    <button className="btn btn-danger btn-xs"
                            onClick={()=> this.removeItem(this.props.index)}>&Chi;</button>
                </td>
            </tr>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeItem: removeItem,
        selectItem: selectItem,
        confirmAction: confirmAction
    }, dispatch);

}

export default connect(null, mapDispatchToProps)(OrderItem);