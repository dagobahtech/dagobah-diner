import React, {Component} from 'react'
import OrderList from '../containers/order/order-list';
import CategoryMenu from '../containers/order/category-menu';
import {connect} from 'react-redux';
import {populateItem} from '../actions/order';
import {bindActionCreators} from 'redux';
const io = require("socket.io-client");


class OrderBoard extends Component {

   socket = io();

   componentDidMount() {

       //use the socket from reducer
        this.socket.emit("getItems");

        //socket.emit("getItems" );

        (function(myThis){
            myThis.socket.on("sendData", function(data){
                console.log("getting items");
                myThis.props.populateItem(data);
                //console.log(data);
            });
        })(this)
        
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12"><CategoryMenu/></div>
                <div className="col-lg-4 col-md-12 col-sm-12"><OrderList /></div>

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