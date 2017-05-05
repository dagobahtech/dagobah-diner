import React, {Component} from 'react'
import MenuItem from './menu-item';

import CategoryNavigation from './category-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getMenuFor} from '../../actions/order/index';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/**
 * This is shows a list of items in the selected category
 * */

class CategoryMenu extends Component {

    constructor(props) {
        super(props);
        this.props.getMenuFor('main');
    }

    createMenuItems() {
        return (
            this.props.menuItems.map(function (item) {
                return <MenuItem item={item} key={item.id}/>
            })
        )
    }

    render() {
        return (
            <div className="panel panel-danger">
                <div className="panel-heading center-align">
                    <CategoryNavigation/>
                </div>
                <div className="panel-body menu">
                    <ReactCSSTransitionGroup transitionName="menu"
                                             transitionEnterTimeout={300}
                                             transitionLeaveTimeout={300}>
                    {this.createMenuItems()}
                    </ReactCSSTransitionGroup>
                </div>

            </div>

        );
    }
}

/**
 * takes the state of the store and it passes it to
 * your component as a property
 */

function mapStateToProps(state) {
    return {
        menuItems: state.menuItems //now we can use this.props.menuItems
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getMenuFor: getMenuFor
    }, dispatch)
}

/**
 * To be able to use the function above we need this function
 * we are basically making this component aware of the store
 * so this component can use it
 *
 * connect is from react-redux
 * */
export default connect(mapStateToProps, matchDispatchToProps)(CategoryMenu);
