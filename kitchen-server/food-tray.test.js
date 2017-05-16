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
    newItemList.add(item1);
    newItemList.add(item2);
    newItemList.add(item3);
    return newItemList;
});

afterAll(() => {
    newItemList = null;
    return newItemList;
});

test("Has proper size", () => {
    expect(newItemList.size).toBe(3);
});

test("Doesn't let you add a non-item", () => {
    function addItem4() {
        newItemList.add(item4);
    }
    expect(addItem4).toThrow("item is not of type Item");
});

test("Item id at index 0", () => {
    function itemAtZero() {
        var itemTemp = newItemList.foodAtIndex(0);
        return itemTemp.id
    }
    expect(itemAtZero()).toBe(1);
});
