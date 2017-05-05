/**
 * basically reducers listen to state even though this action
 * has nothing to do with the state*/
export default function(state=null, action) { //default value is null
    //remember the type is one of the parts of an action object
    //the other one is payload
    switch(action.type) {
        case "ITEM_SELECTED":
            return {payload:action.payload, isNew:action.isNew};
        case "RESET_ACTIVE_ITEM":
            return null;
        default:
            return state;
    }
}