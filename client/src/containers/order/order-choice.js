import React, {Component} from 'react'
import {setOrderType} from '../../actions/order/index';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class OrderChoice extends Component {

    exitToUp = false;

    componentDidMount() {
        this.exitToUp = true;
    }

    gotoOrderPage(forToGo) {
        this.refs.container.className = "container-fluid transition-item enter-down-exit-up"
        console.log(this.exitToUp);
        this.props.setOrderType(forToGo?"Dine Out" : "Eat In");
        browserHistory.push('/order');
    }
    render() {

        return (

            <div ref="container" className="container-fluid transition-item enter-up-exit-down" style={{'backgroundColor':'green'}}>
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-success" onClick={()=> this.gotoOrderPage(false)}>For Here</button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-success" onClick={()=> this.gotoOrderPage(true)}>To Go</button>
                    </div>
                </div>

            </div>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setOrderType: setOrderType
    }, dispatch)
}
//export default OrderChoice;
export default connect(null, matchDispatchToProps)(OrderChoice);