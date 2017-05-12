'use-strict';
const Item = require("./item");

class ItemList {

    constructor() {
        this._items = [];
    }

    addItem(item) {
        if(item instanceof Item) {
            this._items.push(item);
        } else {
            throw item + ". item is not of type Item";
        }
    }

    getItemIndexByName(name) {

        for(let x = 0 ; x < this._items.length ; x++) {

        }
    }

    getItemByIndex(index) {
        return this._items[index];
    }

    getItemsById(itemId) {
        let result = [];

        for(let x = 0, items = this._items ; x < items.length ; x++) {
            if(items[x].id === itemId){
                result.push(items[x]);
            }
        }
        return result;
    }

    getItemsByIdNotDone(itemId) {
        let result = [];

        for(let x = 0, items = this._items ; x < items.length ; x++) {
            if(items[x].id === itemId && !items[x].isDone){
                result.push(items[x]);
            }
        }
        return result;
    }

    get length() {
        return this._items.length;
    }

    isEmpty() {
        return this._items.length === 0;
    }

    printItems() {
        for(let x = 0 ; x < this._items.length ; x++) {
            let item = this.getItemByIndex(x);
            console.log(item.toString());
        }
    }

    clear() {
        this._items.length = 0;
    }
}

module.exports = ItemList;