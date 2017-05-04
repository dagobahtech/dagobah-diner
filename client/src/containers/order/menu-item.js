import React, {Component} from 'react'
import '../../css/order/menu.css'
//import the actions
import {selectItem} from '../../actions/order/index';


import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
/**
 * This component represents each item in the menu
 * */
class MenuItem extends Component {

    render() {
        /**
         * the structure of the item object is {
         * name: the item name,
         * description: the item description,
         * price: the item price,
         * image: the url of the item's image
         * }
         * use wisely :)
         * the item can be access using this.props.item
         * */
        return (
            <div className="panel panel-danger col-md-3 menu-item"
                 onClick={() => this.props.selectItem(this.props.item, true)}>
                <div className="panel-heading">{this.props.item.name}</div>
                <div className="panel-body">Item pic</div>
                <div className="panel-footer">Price: {this.props.item.price}</div>
            </div>
        );
    }
}

/**
 * to hook action to redux we need to do this
 * this is basically making the function as a property
 * rather than using it directly (remember the .props)
 * */
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        selectItem: selectItem
        //so basically what happens here is that the selectItem function that we imported
        //can now be access via the selectItem as a prop: this.props.selectItem.
    }, dispatch)
}

/**
 * To be able to use the function above we need this function
 * we are basically making this component aware of the action
 * so this component can use it
 *
 * connect is from react-redux
 * */
export default connect(null, matchDispatchToProps)(MenuItem);