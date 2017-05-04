//this is an action creator and not the function,
//it returns the action object
export function selectItem(item, isNew) {
    return {
        //type of action, you can set this up to whatever,
        //but should correspond to action and should be meaningful
        type: "ITEM_SELECTED",
        //you can set the key value to anything, this is just a convention for consistency
        payload: item,
        //just a boolean to check whether item came from menu or from order list
        //true if it came from menu, false if customer is editing an item
        isNew: isNew
    }
}

//adds an item to list of items in an order
export function addItemToOrder(item, isNew) {
    console.log("dispatching add item to order");
    return {
        type: "ADD_ITEM_TO_ORDER",
        payload: item,
        isNew: isNew
    }
}


//removes an item in the order
export function removeItem(index) {
    return {
        type: "REMOVE_ORDER_ITEM",
        index
    }
}

export function removeAllItem() {
    console.log("removing all item");
    return {
        type: "REMOVE_ALL_ITEM"
    }
}

export function resetActiveItem() {
    console.log("reset the active item");
    return {
        type: "RESET_ACTIVE_ITEM"
    }
}

export function getTotal() {
    console.log("getting total");
    return {
        type: "GET_TOTAL"
    }
}

export function getMenuFor(category) {
    console.log(category);

    return {
        type: "GET_MENU_ITEMS",
        category: category
    }
}