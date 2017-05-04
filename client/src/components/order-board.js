import React, {Component} from 'react'
import OrderList from '../containers/order/order-list';
import CategoryMenu from '../containers/order/category-menu';
import ActiveItem from '../containers/order/active-item';

class OrderBoard extends Component {

    render() {
        return (
            <div className="row">
                <div className="col-md-8"><CategoryMenu/></div>
                <div className="col-md-4"><OrderList changeView={this.props.changeView}/></div>
                <ActiveItem/>
            </div>
        );
    }
}

export default OrderBoard;