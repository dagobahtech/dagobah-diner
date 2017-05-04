// a reducers takes in two things:
// 1. the action - the information of what happened
// 2. copy of current state
export default function(state=[], action) {
     switch(action.type) {
        case "ADD_ITEM_TO_ORDER":
            //check if the item already exists
            const index = state.findIndex((item) => action.payload.id === item.id);
            if(index === -1) {
                //if it's not append the new item
                return [...state, action.payload];
            } else {
                //else update the existing item
                //if this is an item from the menu and the item already exists
                //add them
                let item = Object.assign({}, action.payload);
                if(action.isNew) {
                    item.quantity += state[index].quantity;
                }
                return [...state.slice(0, index), item,
                    ...state.slice(index+1)];
            }
         case "REMOVE_ALL_ITEM":
             return [];
         case "REMOVE_ORDER_ITEM":
             return [...state.slice(0, action.index), ...state.slice(action.index+1)];

         default:
            return state;
    }

}

