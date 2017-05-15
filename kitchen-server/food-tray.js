'use-strict';
const Item = require("./item");

class FoodTray {

    constructor() {
        this._items = [];
    }

    get items() {
        return this._items;
    }
    clear() {
        this._items.length = 0;
    }

    add(item) {
        if(item instanceof Item) {
            this._items.push(item);
        } else {
            console.log(item, "item is not of type Item");
        }
    }

    indexOf(item) {

        for(let x = 0 ; x < this._items.length ; x++) {
            if(item.id === this._items[x].id) {
                return x;
            }
        }
        return -1
    }

    foodAtIndex(index) {
        if(index >= this.size) {
            return;
        }
        return this._items[index];
    }
    removeAtIndex(index) {
        if(index >= this.size) {
            return;
        }
        return this._items.splice(index, 1);
    }

    get size() {
        return this._items.length;
    }
}

module.exports = FoodTray;