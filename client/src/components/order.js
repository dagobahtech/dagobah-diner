import React, {Component} from 'react'
//these are the containers for this component
import OrderBoard from '../components/order-board';
import Banner from './banner';
import ConfirmationBox from '../components/confirmation-box';


//import css
import '../css/order/menu.css'



/**
 * Order layout/board. This is also a dumb class (class only made for layout)
 * */
class Order extends Component {
    //The CategoryNavigation tag only shows whatever is in the CategoryNavigation class
    //same with others

    render() {

        return (

                <div className="container-fluid transition-item enter-up-exit-down">
                    <ConfirmationBox/>
                    <div className="container-fluid">
                        <Banner/>
                    </div>
                    <div className="container-fluid">
                        <OrderBoard/>
                    </div>
                </div>

        )
    }
}

export default Order;