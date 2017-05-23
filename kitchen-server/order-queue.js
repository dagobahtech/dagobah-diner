'use-strict';

const Queue = require("./queue");
const Order = require("./order");

class OrderQueue {

    constructor() {
        this._queue = new Queue();
    }

    addOrder(order) {
        //check if order is of type order
        if(order instanceof Order) {
            this._queue.enqueue(order);
        } else {
            throw JSON.stringify(order) + "order is not of type Order";
        }
    }

    clear() {
        this._queue.clear();
    }

    get orders() {
        return this._queue.items;
    }

    removeAtIndex(index) {
        return this._queue.removeAtIndex(index);
    }


}

module.exports = OrderQueue;