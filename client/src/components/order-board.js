import React, {Component} from 'react'
import OrderList from '../containers/order/order-list';
import CategoryMenu from '../containers/order/category-menu';
import ActiveItem from '../containers/order/active-item';
import {connect} from 'react-redux';
import {populateItem} from '../actions/order';
import {bindActionCreators} from 'redux';

const io = require("socket.io-client");
const socket = io();

class OrderBoard extends Component {

   

    componentDidMount() {

        socket.emit("getItems" );
        (function(myThis){
            socket.on("sendData", function(data){
                console.log("somteing");
                myThis.props.populateItem(data);
                console.log(data);
            });
        })(this)
        
    }

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

function mapStateToProps(state) {
    return {
        orderedItems: state.orderedItems //now we can use this.props.orderedItems
    };
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({
        populateItem:populateItem
    }, dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(OrderBoard);