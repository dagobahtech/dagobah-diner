var Queue = require('./queue');

function Kitchen() {

    var orderQueue = new Queue();

    this.addOrderToQueue = function(item) {
        orderQueue.enqueue(item);
    };

    this.getNextOrder = function () {
        return orderQueue.dequeue();
    };

    this.peekNextOrder = function () {
        return orderQueue.peek();
        //just peek the item
    };
}

module.exports = Kitchen;