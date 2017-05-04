import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getMenuFor} from '../../actions/order/index';
import '../../css/order/menu.css'
/**
 * This is the side bar selector for menu category
 * */
class CategoryNavigation extends Component {

    constructor() {
        super();
        this.state = {
            currentView: 'main'
        }
    }

    setView(view){
        this.props.getMenuFor(view);
        this.setState({currentView: view});
    }
    //TODO change how this would look like
    render() {
        //specify a class set

        var classString = "btn btn-secondary btn-danger btn-lg";
        var classStringMain = classString;
        var classStringSide = classString;
        var classStringBev = classString;

        if(this.state.currentView === "main") {
            classStringMain += " active";
        } else if(this.state.currentView === "side") {
            classStringSide += " active";
        } else {
            classStringBev += " active";
        }


        return (

            <div className="btn-group menu-button" role="group">
                <button type="button" className={classStringMain}
                        onClick={() => this.setView('main')}
                        >
                    Main
                </button>
                <button type="button" className={classStringSide}
                        onClick={() => this.setView('side')}>
                    Side
                </button>
                <button type="button" className={classStringBev}
                        onClick={() => this.setView('beverage')}>
                    Beverage
                </button>
            </div>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getMenuFor: getMenuFor
    }, dispatch)
}

export default connect(null, matchDispatchToProps)(CategoryNavigation);