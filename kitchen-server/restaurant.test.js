/**
 * Created by Brett Dixon on 2017-05-16.
 */
const Store = require("./restaurant");

var newStore = new Store();

var menu = [{
    id: 1,
    name: "Elephont Burger",
    price: 5
}, {
    id: 2,
    name: "Fried Slugs",
    price: 2
}, {
    id: 3,
    name: "BogWater",
    quantity: 1
}];

beforeAll(() => {
    newStore.menuItems = menu;
    return newStore;
});

afterAll(() => {
    newStore = null;
    return newStore;
});

test("Store has a menu", () => {
    expect(newStore.menuItems).toEqual(menu);
});

test("Store has been opened", () => {
    expect(newStore.isOpen).toBeTruthey;
});

test("Store has a kitchen", () => {
    expect(newStore.kitchen).toBeDefined;
});

test("Store can be closed", () => {
    newStore.isOpen = false;
    expect(newStore.isOpen).toBeFalsey
});