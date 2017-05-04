import React, {Component} from 'react'
//these are the containers for this component
import Welcome from '../containers/order/welcome';
import OrderBoard from '../components/order-board';
import OrderProcessing from '../components/order-processing';
import Banner from './banner';

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
    constructor() {
        super();
        this.state = {
            currentView: "welcome"
        }

        this.changeView = this.changeView.bind(this);
    }

    changeView(view) {
        this.setState({currentView: view});
    }

    render() {

        var comp = null;
        switch (this.state.currentView) {
            case "welcome":
                comp = <Welcome changeView={this.changeView}/>;
                break;
            case "main":
                comp = <OrderBoard changeView={this.changeView}/>
                break;
            case "processing":
                comp = <OrderProcessing/>
                break;
            default:
                    break;
            }

            return (
            <Provider store={store}>
                <div className="container-fluid">
                    <div className="row">
                        <Banner/>
                    </div>
                    <div className="row">
                        <ReactCSSTransitionGroup component="div" transitionName="view"
                                                 transitionEnterTimeout={300}
                                                 transitionLeaveTimeout={300}>
                            {comp}
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
            </Provider>
            )
    }
}


            export default Order;