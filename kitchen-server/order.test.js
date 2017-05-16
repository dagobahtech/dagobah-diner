/**
 * Created by Brett Dixon on 2017-05-15.
 */
const Item = require("./item");
const Order = require("./order");

var orderNumber = 1;

var item1 = new Item(1, "Elephont Burger", true, new Date().getTime());
var item2 = new Item(2, "Fried Slugs", true, new Date().getTime()-70000);  //Expired item
var item3 = new Item(3, "BogWater", true, new Date().getTime());
var item4 = new Item(1, "Elephont Burger", false, new Date().getTime());

var newOrder = new Order(orderNumber);

beforeAll(() => {
    newOrder.addItem(item1);
    newOrder.addItem(item2);
    newOrder.addItem(item3);
    newOrder.addItem(item4);
    return newOrder;
});

afterAll(() => {
    newOrder = null;
    return newOrder;
});


test("Returns order number", () => {
    expect(newOrder.number).toBe(1);
});

test("List of items by id", () => {
    var items = [item1, item4];
    expect(newOrder.getItemsById(1)).toMatchObject(items);
});

test("List of items by id not done", () => {
    var items = [item4];
    expect(newOrder.getItemsByIdNotDone(1)).toMatchObject(items);
});

test("Is the order done?", () => {
    expect(newOrder.isDone()).toBeFalsy;
});