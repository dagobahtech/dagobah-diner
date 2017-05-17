/**
 * import all reducers and combine them here
 * */

import {combineReducers} from 'redux';
import OrderedItemReducer from './reducer-order-items';
import MenuItemsReducer from './reducer-menu-items';
import ActiveItemReducer from './reducer-active-item';
import ConfirmModalState from './reducer-confirmation';
import ProcessedOrderReducer from './reducer-processed-order';


const allReducers = combineReducers({
    menuItems: MenuItemsReducer,
    orderedItems: OrderedItemReducer,
    activeItem: ActiveItemReducer,
    modalState: ConfirmModalState,
    processedOrder: ProcessedOrderReducer
});

export default allReducers;