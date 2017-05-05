import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Order from './components/order';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Order} />
                </div>
            </Router>
        );
    }
}

export default App;
