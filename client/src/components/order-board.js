import React, {Component} from 'react'
import OrderList from '../containers/order/order-list';
import CategoryMenu from '../containers/order/category-menu';
import ActiveItem from '../containers/order/active-item';
import {connect} from 'react-redux';

class OrderBoard extends Component {

    constructor() {
        super();
        this.state = ({
            total: 0
        });
        this.updateTotal = this.updateTotal.bind(this);
    }

    updateTotal() {

        console.log("updating total");
        //calculate the total
        let runningTotal = 0;
        let items = this.props.orderedItems;
        for (let x = 0 ; x < items.length ; x++) {
            runningTotal += items[x].quantity * items[x].price;
        }
        console.log("running total is" ,runningTotal);
        this.setState({total:runningTotal});
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-8"><CategoryMenu/></div>
                <div className="col-md-4"><OrderList changeView={this.props.changeView}
                                                     total={this.state.total}
                                                     updateTotal={this.updateTotal}/></div>
                <ActiveItem updateTotal={this.updateTotal}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        orderedItems: state.orderedItems //now we can use this.props.orderedItems
    };
}

export default connect(mapStateToProps)(OrderBoard);