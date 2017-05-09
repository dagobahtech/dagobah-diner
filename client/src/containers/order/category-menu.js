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
        //console.log(this.props.menuItems);
        let items = [];
        switch(this.props.menuItems.current){
            case 'main':
                items = this.props.menuItems.main;
                break;

            case 'side':
                items = this.props.menuItems.side;
                break;

            case 'beverage':
                items = this.props.menuItems.beverage;
                break;
            default: break;
        }
        return (
            items.map(function (item) {
                return (
                    <div className="col-md-3 pb-4 menu-item-container" key={item.id}>
                        <MenuItem item={item}  isClickable={true}/>
                    </div>
                    )
            })
        )
    }1

    render() {
        return (
            <div className="card card-danger">
                <div className="card-header center-align">
                    <CategoryNavigation/>
                </div>
                <div className="card-block menu" style={{'backgroundColor': 'white'}}>
                    <div className="container-fluid">
                        <div className="col-md-3 pb-4 menu-item-container" key={1}>
                        </div>
                        <ReactCSSTransitionGroup transitionName="menu"
                                                 transitionEnterTimeout={300}
                                                 transitionLeave={false}
                                                 component="div"
                                                 className="row">

                            {this.createMenuItems()}

                        </ReactCSSTransitionGroup>

                    </div>
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
