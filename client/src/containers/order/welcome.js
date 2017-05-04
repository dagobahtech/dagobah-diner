import React, {Component} from 'react'
import '../../css/order/menu.css'

class Welcome extends Component {

    render() {
        return (
            <div className="welcome-bg">
                <div className="TWords">Restaurant Name</div>
                <button onClick={()=>this.props.changeView("main")}>Start Ordering Now</button>
            </div>
        );
    }
}

export default Welcome;