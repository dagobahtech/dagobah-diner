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
            <tr className="row">
                <td className="col-md-1"><button className="btn btn-danger btn-sm"
                                                 onClick={()=> this.removeItem(this.props.index)}>&Chi;
                </button></td>

                <td className="col-md-4">{this.props.item.name}</td>
                <td className="col-md-1">{this.props.item.quantity}</td>
                <td className="col-md-2">
                    <NumberFormat value={this.props.item.price}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                                  suffix={' IC'}
                                  />
                    </td>
                <td className="col-md-2">
                    <NumberFormat value={this.props.item.quantity * this.props.item.price}
                                  decimalPrecision={2}
                                  displayType={'text'} thousandSeparator={true}
                                  suffix={' IC'}
                    /></td>
                <td className="col-md-2">
                    <button className="btn btn-warning btn-sm"
                            onClick={()=>this.props.selectItem(this.props.item, false)}>View</button>

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