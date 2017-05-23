const initialState = {
    id: 0,
    items: [], // no items in cart
    total: 0,
    subTotal: 0,
    comboDiscount: 0
};

export default function(state=initialState, action) {

    switch(action.type) {
        case "SET_PROCESSED_ORDER":
            console.log("set processed order");
            console.log(action.payload);
            let newState = {...action.payload};
            return newState;
        case "RESET_PROCESSED_ORDER":
            return initialState;
        default:
            return state;
    }
}
