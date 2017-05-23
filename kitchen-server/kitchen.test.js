/**
 * Created by Brett Dixon on 2017-05-16.
 */
const Kitchen = require("./kitchen");
const Order = require("./order");
const Item = require("./item");

var newKitchen = new Kitchen();

var orderNumber = 1;

var item1 = new Item(1, "Elephont Burger", false, 0);
var item2 = new Item(2, "Fried Slugs", false, 0);
var item3 = new Item(3, "BogWater", false, 0);

var orderClient1 = {
    id: 0,
    items: [{
        id: 1,
        name: "Elephont Burger",
        quantity: 1
    }, {
        id: 2,
        name: "Fried Slugs",
        quantity: 2
    }, {
        id: 3,
        name: "BogWater",
        quantity: 1
    }]
};

var orderClient2 = {
    id: 1,
    items: [{
        id: 2,
        name: "Fried Slugs",
        quantity: 2
    }, {
        id: 3,
        name: "BogWater",
        quantity: 1
    }]
};

var orderClient3 = {
    id: 2,
    items: [{
        id: 3,
        name: "BogWater",
        quantity: 1
    }]
};


beforeAll(() => {
    newKitchen.addOrder(orderClient1);
    newKitchen.addOrder(orderClient2);
    newKitchen.addOrder(orderClient3);
    return newKitchen;
});

afterAll(() => {
    newKitchen = null;
    return newKitchen;
});

test("Valid Quantities", () => {
    expect(newKitchen.canCook(6)).toBeTruthy;
    expect(newKitchen.canCook(5)).toBeFalsey;
});

test("Gets possible items by id", () => {
    var temp = [item3, item3, item3];
    expect(newKitchen._getPossibleItems(3)).toEqual(temp);
});

test("Cook some items", () => {
    newKitchen.cook(item1, 6);
    expect(item1.isDone).toBeTruthey;
});


test("Can Discard an item", () => {
    let temp1 = newKitchen.foodTray;
    newKitchen.discard(false,0,0);  //should discard the first item in the Food tray.
    expect(temp1.items.length).toEqual(4);
    newKitchen.discard(true,0,0);
    expect(newKitchen._orderQueue.orders[0].items._items[0].isDone).toBeTruthey;
});


test("Can set new cooking delay", () => {
    newKitchen.cookDelay = 7000;
    expect(newKitchen.cookDelay).toEqual(7000);
});

