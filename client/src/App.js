import React, {Component} from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Order from './components/order';
import Welcome from './containers/order/welcome';
import Home from './components/home';
import OrderChoice from './containers/order/order-choice';



class App extends Component {
    render() {
        return (

                <Router history={browserHistory}>
                    <Route path="/" component={Home}>
                        <IndexRoute component={Welcome}/>
                        <Route path="choice" component={OrderChoice} />
                        <Route path="order" component={Order}/>
                    </Route>
                </Router>

        );
    }
}

export default App;
