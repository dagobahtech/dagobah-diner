'use-strict';

const ItemList = require("./item-list");
class Order {

    constructor(orderNumber) {
        this._items = new ItemList();
        this._orderNumber = orderNumber;
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items;
    }
    get number() {
        return this._orderNumber;
    }

    addItem(item) {
        this._items.addItem(item);
    }

    printOrder() {
        console.log("ORDER NUMBER", this._orderNumber);
        console.log("ITEMS");
        this._items.printItems();
    }

    getItemsById(itemId) {
        return this._items.getItemsById(itemId);
    }

    getItemsByIdNotDone(itemId) {
        return this._items.getItemsByIdNotDone(itemId);
    }

    //function to check whether this order is done
    isDone() {

        let length = this.items.length;

        //iterate through the items in this order
        for(let x = 0 ; x < length ; x++) {
            //if something is not done yet
            //then return false
            if(!this.items.getItemByIndex(x).isDone) {
                return false;
            } else {
                if(this.items.getItemByIndex(x).isExpired()) {
                    return false;
                }
            }


        }
        //if it reaches this point. they are all done
        //then return done
        return true;
    }

}

module.exports = Order;