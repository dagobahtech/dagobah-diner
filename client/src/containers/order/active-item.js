import React, {Component} from 'react'
import {resetActiveItem, addItemToOrder} from '../../actions/order/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../../css/order/menu.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/**
 * This is the component for the active item:
 * when the customer clicks an item, this component
 * pops up
 * */
class ActiveItem extends Component {

    updateQuantity(direction) {
        let quantity = parseInt(this.refs.quantity.value, 10);

        if(direction === "increment") {
            quantity += 1;
        } else {
            if(quantity !== 1) {
                quantity -= 1;
            }
        }
        this.refs.quantity.value = quantity;
    }

    addToOrder() {
        console.log("hello");
        console.log(this.props.menuItems)
        console.log("hello");
        //make sure quantity is int
        let quantity = parseInt(this.refs.quantity.value, 10);
        this.props.resetActiveItem();
        //var item = Object.assign({}, ...this.props.activeItem);
        //this.. i don't why.. but i almost this killed me
        const item = {
            id: this.props.activeItem.payload.id,
            name: this.props.activeItem.payload.name,
            description: this.props.activeItem.payload.description,
            price: this.props.activeItem.payload.price,
            image: this.props.activeItem.payload.image,
            quantity: quantity
        };
        //item.payload.quantity = 7;
        this.props.addItem(item, this.props.activeItem.isNew);
        //then reset the current active item

    }

    render() {

        const heading = (!this.props.activeItem || this.props.activeItem.isNew) ?  "Add New Item" : "View Item";
        const buttonMessage = (!this.props.activeItem || this.props.activeItem.isNew) ?  "Add" : "Save";
        var comp = null;

        if(this.props.activeItem) {
            comp = (

                <div className="panel panel-success item-popup">
                    <div className="panel-heading">
                        <h2>{heading}</h2>
                    </div>
                    <div className="panel-body">
                        <h2>{this.props.activeItem.payload.name}</h2>
                        <p>{this.props.activeItem.payload.description}</p>
                        <button onClick={()=>this.updateQuantity("decrement")}>Less</button>
                        <input type="number" defaultValue={this.props.activeItem.payload.quantity}
                               ref="quantity" name="quantity" min="1" step="1" readOnly/>
                        <button onClick={()=>this.updateQuantity("increment")}>More</button>
                        <button onClick={()=>this.addToOrder()}>{buttonMessage}</button>
                        <button onClick={()=>this.props.resetActiveItem()}>Cancel</button>
                    </div>
                </div>

            );
        }

        return (
            <ReactCSSTransitionGroup component="div" transitionName="popup"
                                     transitionEnterTimeout={300}
                                     transitionLeaveTimeout={300}>
                {comp}
            </ReactCSSTransitionGroup>


        )

    }
}

function mapStateToProps(state) {
    return {
        activeItem: state.activeItem, //now we can use this.props.menuItems
        menuItems: state.menuItems
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        addItem: addItemToOrder,
        //so basically what happens here is that the selectItem function that we imported
        //can now be access via the selectItem as a prop: this.props.selectItem.,
        resetActiveItem: resetActiveItem
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ActiveItem);
