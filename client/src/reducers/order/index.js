/**
 * import all reducers and combine them here
 * */

import {combineReducers} from 'redux';
import OrderedItemReducer from './reducer-order-items';
import MenuItemsReducer from './reducer-menu-items';
import ActiveItemReducer from './reducer-active-item';
import ConfirmModalState from './reducer-confirmation';
import SocketReducer from './reducer-sockets';

const allReducers = combineReducers({
    menuItems: MenuItemsReducer,
    orderedItems: OrderedItemReducer,
    activeItem: ActiveItemReducer,
    modalState: ConfirmModalState,
    socket: SocketReducer
});

export default allReducers;