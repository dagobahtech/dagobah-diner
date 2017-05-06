import React, {Component} from 'react'
//these are the containers for this component
import Welcome from '../containers/order/welcome';
import OrderBoard from '../components/order-board';
import OrderProcessing from '../components/order-processing';
import Banner from './banner';
import ConfirmationBox from '../components/confirmation-box';


//these stuffs are needed for the store where all the data
//needed for this page are kept so every component can access them
//setting it looks complicated, but it helps a lot.
import {createStore} from 'redux';
import allReducers from '../reducers/order'
import {Provider} from 'react-redux'
//import css
import '../css/order/menu.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//create a store when all data related to order page are stored
const store = createStore(allReducers);

/**
 * Order layout/board. This is also a dumb class (class only made for layout)
 * */
class Order extends Component {
    //The CategoryNavigation tag only shows whatever is in the CategoryNavigation class
    //same with others

    render() {

        return (
            <Provider store={store}>
                <div className="container-fluid transition-item order-page">
                    <ConfirmationBox/>
                    <div className="row">
                        <Banner/>
                    </div>
                    <div className="row">
                            <OrderBoard/>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Order;