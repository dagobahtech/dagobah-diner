const initialConstraints = {
    maxItemQuantity : 6,
    maxItemCount: 10
};

export default function(state=initialConstraints, action) {

    switch(action.type) {

        //set maxQuantity
        case "SET_MAX_ITEM_QUANTITY":
            {
                let newState = {...state};
                newState.maxItemQuantity = action.payload;
                return newState;
            }
        case "SET_MAX_ITEM_COUNT":
            {
                let newState = {...state};
                newState.maxItemCount = action.payload;
                return newState;
            }
        case "SET_CONSTRAINTS":
            {
                let newState = {...state};
                newState.maxItemQuantity = action.maxItemQuantity;
                newState.maxItemCount = action.maxItemCount;
                return newState;
            }
        default:
            return state;

    }
}