// a reducers takes in two things:
// 1. the action - the information of what happened
// 2. copy of current state

//set up an initial state
const initialState = {
    items: [], // no items in cart
    total: 0 //current total is zero
};


export default function(state=initialState, action) {
     switch(action.type) {
         case "ADD_ITEM_TO_ORDER":
            //check if the item already exists

            const index = state.items.findIndex((item) => action.payload.id === item.id);
            if(index === -1) {
                let newState = {...state};
                //if it's not append the new item
                newState.items = [...newState.items, action.payload];
                newState.total += action.payload.quantity * action.payload.price; //just add the price of the new one
                return newState;
            } else {
                //else update the existing item
                //if this is an item from the menu and the item already exists
                //add them
                let newState = {...state};
                let item = {...newState.items[index]};

                let diff = 0;
                if(action.isNew) {
                    diff = action.payload.quantity;
                    item.quantity += action.payload.quantity;
                } else {
                    diff = action.payload.quantity - item.quantity;
                    item.quantity = action.payload.quantity;
                }
                let adjustValue = diff * item.price;
                newState.items = [...newState.items.slice(0, index), item, ...newState.items.slice(index + 1)];
                newState.total += adjustValue;
                return newState;
            }
         case "REMOVE_ALL_ITEM":
             return initialState;
         case "REMOVE_ORDER_ITEM":
             let newState = {...state};
             let subTotal = newState.items[action.index].quantity * newState.items[action.index].price;
             newState.items = [...newState.items.slice(0, action.index), ...newState.items.slice(action.index+1)];
             newState.total -= subTotal;
             return newState;

         default:
            return state;
    }

}

