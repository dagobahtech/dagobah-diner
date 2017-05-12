'use-strict';

class Queue {

    constructor() {
        this._items = []
    }

    //get the items
    get items() {
        return this._items;
    }

    //enqueue an order
    enqueue(item) {
        this._items.push(item);
    }

    //dequeues the item and returns
    //the dequeued item
    dequeue() {
        return this._items.shift();
    }

    //checks the first item in the line
    peek() {
        return this._items[0];
    }

    //checks whether the queue is empty
    isEmpty() {
        return this._items.length === 0;
    }

    //return the length of the queue
    get length() {
        return this._items.length;
    }

    //this is unusual for a queue. but whatever
    removeAtIndex(index) {
        if(index >= this.length) {
            return;
        }

        return this._items.splice(index, 1)[0];
    }

    //clears the queue
    clear() {
        this._items.length = 0;
    }

}

module.exports = Queue;