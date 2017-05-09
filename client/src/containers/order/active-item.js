import React, {Component} from 'react'
import {resetActiveItem, addItemToOrder, closeConfirmation} from '../../actions/order/index';
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
        //make sure quantity is int
        let quantity = parseInt(this.refs.quantity.value, 10);

        //var item = Object.assign({}, ...this.props.activeItem);
        //this.. i don't why.. but i almost this killed me
        let item = {...this.props.item};
        item.quantity = quantity;
        this.props.addItem(item, this.props.isNew);
        //then reset the current active item
        //this.props.resetActiveItem();
        this.props.closeConfirmation();
    }

    render() {

        const buttonMessage = (this.props.isNew) ?  "Add" : "Save";
        let comp = (
            <div className="card item-popup">
                <h3 className="card-header">{this.props.item.name}</h3>
                <div className="card-block">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8">
                                <p>
                                    {this.props.item.description}
                                </p>
                            </div>
                            <div className="col-md-4">
                                <div style={{'height':'150px', 'background-color':'gray'}}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 center-align">
                                <button className='btn btn-danger' onClick={()=>this.updateQuantity("decrement")}>-</button> &nbsp;
                                <input className='center-align' style={{'border':'0', 'font-weight':'bold'}} size='3' width='15px' type="text" defaultValue={this.props.item.quantity}
                                       ref="quantity" name="quantity" min="1" step="1" readOnly/>&nbsp;
                                <button className='btn btn-success' onClick={()=>this.updateQuantity("increment")}>+</button>
                            </div>
                            <div className="col-md-4 center-align">
                                <h4><NumberFormat value={this.props.item.price}
                                                  decimalPrecision={2}
                                                  displayType={'text'} thousandSeparator={true}
                                                  suffix={' IC'}
                                /></h4>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-md-4 offset-md-4 center-align">
                                <button className="btn btn-success btn-block"
                                        onClick={()=>this.addToOrder()}>{buttonMessage}</button>

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

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        addItem: addItemToOrder,
        //so basically what happens here is that the selectItem function that we imported
        //can now be access via the selectItem as a prop: this.props.selectItem.,
        resetActiveItem: resetActiveItem,
        closeConfirmation: closeConfirmation
    }, dispatch)
}

export default connect(null, matchDispatchToProps)(ActiveItem);
