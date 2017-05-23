const initialState = {
    header: "header",
    message: "message",
    isShowing: false,
    todoFunction: null,
    component:null
}

export default function(state=initialState, action) {
    switch(action.type) {
        case "CONFIRM_ACTION":
            let newState = {...state};
            newState.header = action.header;
            newState.message = action.message;
            newState.isShowing = true;
            newState.todoFunction = action.todoFunction;
            newState.component = action.component;
            return newState;
        case "CLOSE_CONFIRMATION":
            return initialState;
        default:
            return state;
    }
}