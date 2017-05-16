/**
 * Created by Brett Dixon on 2017-05-15.
 */
const FoodTray = require("./food-tray");
const Item = require("./item");

var item1 = new Item(1, "Elephont Burger", true, new Date());
var item2 = new Item(2, "Fried Slugs", true, new Date());
var item3 = new Item(3, "BogWater", true, new Date());
var item4 = {
    name: "Fries",
    price: "55"
};

var newTray = new FoodTray();

beforeAll(() => {
    newTray.add(item1);
    newTray.add(item2);
    newTray.add(item3);
    return newTray;
});

afterAll(() => {
    newTray = null;
    return newTray;
});

test("Has proper size", () => {
    expect(newTray.size).toBe(3);
});

test("Doesn't let you add a non-item", () => {
    function addItem4() {
        newTray.add(item4);
    }
    expect(addItem4).toThrow("item is not of type Item");
});

test("Item id at index 0", () => {
    function itemAtZero() {
        var itemTemp = newTray.foodAtIndex(0);
        return itemTemp.id
    }
    expect(itemAtZero()).toBe(1);
});
