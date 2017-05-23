/**
 * Created by Brett Dixon on 2017-05-16.
 */
const Order = require("./order");
const Item = require("./item");
const OrderQueue = require("./order-queue");

var orderNumber = 1;

var item1 = new Item(1, "Elephont Burger", true, new Date().getTime());
var item2 = new Item(2, "Fried Slugs", true, new Date().getTime()-70000);  //Expired item
var item3 = new Item(3, "BogWater", true, new Date().getTime());


var notOrder = {
    stuff: 0,
    swag: 0
};

var newOrder1 = new Order(orderNumber);
var newOrder2 = new Order(orderNumber+1);
var newOrder3 = new Order(orderNumber+2);

var newOrderQueue = new OrderQueue();

beforeAll(() => {
    newOrder1.addItem(item1);
    newOrder1.addItem(item2);
    newOrder1.addItem(item3);
    newOrder2.addItem(item2);
    newOrder2.addItem(item3);
    newOrder3.addItem(item3);

    newOrderQueue.addOrder(newOrder1);
    newOrderQueue.addOrder(newOrder2);
    newOrderQueue.addOrder(newOrder3);
    return newOrderQueue;
});

afterAll(() => {
    newOrderQueue = null;
    return newOrderQueue;
});

test("Doesn't let you add a non-order", () => {
    function addNotItem() {
        newOrderQueue.addOrder(notOrder);
    }
    var temp = JSON.stringify(notOrder) + "order is not of type Order"
    expect(addNotItem).toThrow(temp);
});

test("What's in the order queue?", () => {
    var temp = [newOrder1, newOrder2, newOrder3];
    expect(newOrderQueue.orders).toEqual(temp);
});

test("Remove order by index", () => {
    newOrderQueue.removeAtIndex(1);
    var temp = [newOrder1, newOrder3];
    expect(newOrderQueue.orders).toEqual(temp);
});

test("Clear empties the queue", () => {
    newOrderQueue.clear();
    expect(newOrderQueue.orders.length).toBeTruthy;
});