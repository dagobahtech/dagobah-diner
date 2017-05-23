import React, {Component} from 'react'
import {resetActiveItem, addItemToOrder, closeConfirmation, confirmAction} from '../../actions/order/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../../css/order/menu.css';
import NumberFormat from 'react-number-format';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/**
 * This is the component for the active item:
 * when the customer clicks an item, this component
 * pops up
 * */
class ActiveItem extends Component {

    constructor() {
        super();
        this.state = {
            status: ""
        }
    }
    updateQuantity(direction) {

        let maxQuantity = this.props.itemConstraints.maxItemQuantity;

        if(this.props.isNew) {
            //if its from order, check if it is in the order list
            let items = this.props.orderedItems.items;
            for(let x = 0 ; x < items.length ; x++) {
                if(this.props.item.id === items[x].id) {
                    maxQuantity -= items[x].quantity;
                    break;
                }
            }
        }

        let quantity = parseInt(this.refs.quantity.value, 10);

        if(direction === "increment") {
            if(quantity < maxQuantity) {
                quantity += 1;
            } else {
                this.setState({status: "Sorry, You cannot add more than "+ maxQuantity+" of this item "})
            }
        } else {
            if(quantity !== 1) {
                this.setState({status: ""});
                quantity -= 1;
            }
        }
        this.refs.quantity.value = quantity;
    }

    addToOrder() {
        //before adding this item to order
        //check the max order first

        //make sure quantity is int
        let quantity = parseInt(this.refs.quantity.value, 10);

        //var item = Object.assign({}, ...this.props.activeItem);
        let item = {...this.props.item};
        item.quantity = quantity;

        //let items = this.props.orderedItems.items;

        this.props.addItem(item, this.props.isNew);
        //then reset the current active item
        //this.props.resetActiveItem();
        this.props.closeConfirmation();
    }

    showButtons() {

        return (
            <div>
                <button className='btn btn-danger' onClick={()=>this.updateQuantity("decrement")}>-</button> &nbsp;
                <input className='center-align' style={{'border':'0', 'font-weight':'bold'}} size='3' width='15px' type="text" defaultValue={this.props.item.quantity}
                       ref="quantity" name="quantity" min="1" step="1" readOnly/>&nbsp;
                <button className='btn btn-success' onClick={()=>this.updateQuantity("increment")}>+</button>
                <div style={{"color":"red"}}>
                    {this.state.status}
                </div>
            </div>
        )
    }

    showAdd() {
        const buttonMessage = (this.props.isNew) ?  "Add" : "Save";
        return(
                    <button className="btn btn-success btn-block"
                            onClick={()=>this.addToOrder()}>{buttonMessage}</button>

        )
    }

    showMaxMessage(message) {
        return (<div style={{color:'red'}}> {message}</div>)
    }



    isMaxedItem() {

        let maxQuantity = this.props.itemConstraints.maxItemQuantity;

        if(!this.props.isNew){return false; }
        let items = this.props.orderedItems.items;

        for(let x = 0 ; x < items.length ; x++) {
            if(this.props.item.id === items[x].id) {
                if(items[x].quantity === maxQuantity){
                    return true;
                }
            }
        }
        return false
    }

    isInOrderedItems() {
        let items = this.props.orderedItems.items;

        for(let x = 0 ; x < items.length ; x++) {
            if(this.props.item.id === items[x].id) {
                return true;
            }
        }

        return false;
    }
    render() {

        const maxItems = this.props.itemConstraints.maxItemCount;
        let innerComp;
        let buttonComp;
        //if max orders
        if(this.props.orderedItems.items.length === maxItems) {
            //is it in order?
            if(this.isInOrderedItems()) {
                if (this.isMaxedItem()) {
                    innerComp = this.showMaxMessage("Cannot add more of this item");
                } else {
                    innerComp = this.showButtons()
                    buttonComp = this.showAdd();
                }
            } else {
                innerComp = this.showMaxMessage("Cannot add more items");
            }
        } else {
            if(this.isMaxedItem()) {
                innerComp = this.showMaxMessage("Cannot add more items");
            } else {
                innerComp = this.showButtons();
                buttonComp = this.showAdd();
            }
        }

        //if this is not in ordereditems and is max orders, don't accept
        // if(!isInOrderedItems()) {
        //     if(this.props.orderedItems.items.length === maxOrders) {
        //         innerComp = this.showMaxMessage("Cannot add more items. Max items reached");
        //     }
        // } else {
        //     if(this.isMaxedItem()) {
        //         innerComp = this.showMaxMessage("Cannot add more of this item. Max items reached");
        //     } else {
        //         innerComp = this.showButtons();
        //     }
        // }


        let comp = (
            <div className="card item-popup">
                <div className="card mb-3">
                    <div className="card-img-top menu-item-image" style={{'background-image':'url("/images/'+this.props.item.image_name+'")'}} alt="Card image cap" />
                    <div className="card-block">
                        <h4 className="card-title">{this.props.item.name} : <div className="currency currency-black currency-large"></div>
                            <NumberFormat value={this.props.item.price}
                                          decimalPrecision={2}
                                          displayType={'text'} thousandSeparator={true}
                            /></h4>
                        <p className="card-text">{this.props.item.description}</p>
                        <hr/>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 center-align">
                                    { innerComp }
                                </div>
                            </div>
                            <div>
                                <div className="row mt-2">
                                    <div className="col-12 center-align">
                                        { buttonComp }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

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
        orderedItems: state.orderedItems, //now we can use this.props.orderedItems
        itemConstraints: state.itemConstraints
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        addItem: addItemToOrder,
        //so basically what happens here is that the selectItem function that we imported
        //can now be access via the selectItem as a prop: this.props.selectItem.,
        resetActiveItem: resetActiveItem,
        closeConfirmation: closeConfirmation,
        confirmAction: confirmAction
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ActiveItem);
