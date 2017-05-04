/**
 * import all reducers and combine them here
 * */

import {combineReducers} from 'redux';
import OrderedItemReducer from './reducer-order-items';
import MenuItemsReducer from './reducer-menu-items';
import ActiveItemReducer from './reducer-active-item';


const allReducers = combineReducers({
   menuItems: MenuItemsReducer,
   orderedItems: OrderedItemReducer,
   activeItem: ActiveItemReducer

});

export default allReducers;