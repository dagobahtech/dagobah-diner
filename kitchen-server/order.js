'use-strict';

const ItemList = require("./item-list");
const EXPIRE_TIME = 1; // in mins
class Order {

    constructor(orderNumber) {
        this._items = null;
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
                if(this._isExpired(this.items.getItemByIndex(x))) {
                    console.log("something is expired");
                    return false;
                }
            }


        }
        //if it reaches this point. they are all done
        //then return done
        return true;
    }

    _isExpired(item) {

        var time = new Date().getTime();
        var diff = time - item._time;
        return (diff /60000 >= EXPIRE_TIME);
    }
}

module.exports = Order;