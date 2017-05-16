/**
 * Created by Brett Dixon on 2017-05-15.
 */
const Item = require("./item");
const ItemList = require("./item-list");

var item1 = new Item(1, "Elephont Burger", true, new Date());
var item2 = new Item(2, "Fried Slugs", true, new Date());
var item3 = new Item(3, "BogWater", true, new Date());
var item4 = {
    name: "Fries",
    price: "55"
};
var item5 = new Item(1, "Elephont Burger", false, new Date());


var newItemList = new ItemList();

beforeAll(() => {
    newItemList.addItem(item1);
    newItemList.addItem(item2);
    newItemList.addItem(item3);
    newItemList.addItem(item5);
    return newItemList;
});

afterAll(() => {
    newItemList = null;
    return newItemList;
});

test("Has proper size", () => {
    expect(newItemList.length).toBe(4);
});

test("Doesn't let you add a non-item", () => {
    function addItem4() {
        newItemList.addItem(item4);
    }
    expect(addItem4).toThrow("item is not of type Item");
});

test("Item id at index 0", () => {
    function itemAtZero() {
        var itemTemp = newItemList.getItemByIndex(0);
        return itemTemp.id
    }
    expect(itemAtZero()).toBe(1);
});

test("List is empty", () => {
   var emptyItemList = new ItemList();
   expect(emptyItemList.isEmpty()).toBeTruthy;
});

test("List of items by id", () => {
    var items = [item1, item5];
    expect(newItemList.getItemsById(1)).toMatchObject(items);
});

test("List of items by id not done", () => {
    var items = [item5];
    expect(newItemList.getItemsByIdNotDone(1)).toMatchObject(items);
});

test("Print of item list", () => {
    var output = "";
    for(let x = 0 ; x < newItemList.length; x++) {
        let item = newItemList.getItemByIndex(x);
        output += item.toString()+"\n";
        console.log(item.toString());
    }
    expect(newItemList.printItems()).toBe(output.trim());
});