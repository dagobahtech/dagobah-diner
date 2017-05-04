import React, {Component} from 'react';
import OrderItem from './order-item';
import {connect} from 'react-redux';
import {removeAllItem} from '../../actions/order/index';
import {bindActionCreators} from 'redux';
//import css
import '../../css/order/menu.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/**
 * This components shows all the items that
 * the customer have ordered
 * */
class OrderList extends Component {

    constructor() {
        super();
        this.state = {
            total : 0
        }
    }

    //TODO need to implement this
    confirmAndSubmitOrder() {
        console.log("Order has been submitted");
        const order = {
            id: 0, //should be taken from the server,
            items: this.props.orderedItems,
            total: this.state.total
        }
        console.log(order);
        this.props.changeView("processing");
    }

    render() {
        return(
            <div className="panel panel-danger">
                <div className="panel-heading">
                    <h2>Total : {this.state.total}</h2>
                </div>
                <div className="panel-body container-fluid">

                    <table className="table no-padding">
                        <thead className="left-align">
                        <tr className="left-align ">
                            <th className="col-md-5 left-align no-padding">Item</th>
                            <th className="col-md-1 left-align no-padding">Qty</th>
                            <th className="col-md-2 left-align no-padding">Price</th>
                            <th className="col-md-2 left-align no-padding">Subtotal</th>
                            <th className="col-md-2 no-padding"></th>
                        </tr>
                        </thead>

                        <ReactCSSTransitionGroup component="tbody" transitionName="order"
                                                 transitionEnterTimeout={300}
                                                 transitionLeaveTimeout={300}>
                        {
                            this.props.orderedItems.map(function (item, index) {
                                return (<OrderItem item={item} key={item.id} index={index}/>)
                            })
                        }
                        </ReactCSSTransitionGroup>

                    </table>

                </div>
                <div className="panel-footer right-align">
                    <button className="btn btn-danger" onClick={()=>this.props.removeAllItem()}>Clear Order</button>
                    <button className="btn btn-info" onClick={()=>this.confirmAndSubmitOrder()}>Confirm Order</button>
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
        removeAllItem: removeAllItem
    }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);