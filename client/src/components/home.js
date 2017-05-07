import React, {Component} from 'react'
import PageTransition from "react-router-page-transition";
//these stuffs are needed for the store where all the data
//needed for this page are kept so every component can access them
//setting it looks complicated, but it helps a lot.
import {createStore} from 'redux';
import allReducers from '../reducers/order'
import {Provider} from 'react-redux'

//create a store when all data related to order page are stored
const store = createStore(allReducers);

class Home extends Component {
    
    render() {
        return (
            <PageTransition>
                <Provider store={store}>
                    {this.props.children}
                </Provider>
            </PageTransition>
        );
    }
}

export default Home;