/**
 * Created by Brett Dixon on 2017-05-19.
 */
const MenuItemValidator = require("./menuItemValidator");

const nameErrMessage = "Bad Name - Name must be must between 3 and 50 characters and only contain Alphanumeric characters and single quotations.";
const descErrMessage = "Bad Description - Description must be must between 3 and 100 characters and only contain Alphanumeric characters, single quotations, and round brackets.";
const catErrMessage = "Bad Category - Category can only be 1, 2, or 3.";
const priceErrMessage = "Bad Price - Price must be between 0.01 and 999.99 Imperial Credits.";
const imageErrMessage = "Bad Image - Image filename must be between 1 and 35 Alphanumeric characters with no spaces.  Only png, jpg, jpeg, gif, and tiff extensions allowed.";
const stationErrMessage = "Bad Station - Station can only be 1 to 5.";

var menuTester = new MenuItemValidator();

var goodMenuItem = {
    name: "John's Fried Slugs",
    desc: "6 Pieces of (deep) fried slugs",
    category: 1,
    price: 3,
    image: "John_slugs.png",
    station: 3
};

var badName = {
    name: "J;ohn's Fried Slugs;",
    desc: "6 Pieces of deep fried slugs",
    category: 1,
    price: 3.50,
    image: "John_slugs.png",
    station: 3
};

var badDesc = {
    name: "John's Fried Slugs;",
    desc: "6 Pieces of d;eep fried slugs",
    category: 1,
    price: 3.50,
    image: "John_slugs.png",
    station: 3
};

var badCat = {
    name: "John's Fried Slugs;",
    desc: "6 Pieces of d;eep fried slugs",
    category: "Main",
    price: 3.50,
    image: "John_slugs.png",
    station: 3
};

var badPrice = {
    name: "John's Fried Slugs;",
    desc: "6 Pieces of d;eep fried slugs",
    category: "Main",
    price: "Five",
    image: "John_slugs.png",
    station: 3
};

var badImage = {
    name: "John's Fried Slugs;",
    desc: "6 Pieces of d;eep fried slugs",
    category: "Main",
    price: "Five",
    image: "John_slugs.doc",
    station: 3
};

var badStation = {
    name: "John's Fried Slugs;",
    desc: "6 Pieces of d;eep fried slugs",
    category: "Main",
    price: "Five",
    image: "John_slugs.doc",
    station: "x"
};

test("Test good Menu Item", () => {
    let obj = menuTester.testItem(goodMenuItem);
    expect(obj.passing).toBeTruthy();
});

test("Test bad name", () => {
    let obj = menuTester.testItem(badName);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(nameErrMessage);
});

test("Also Test bad descripton", () => {
    let obj = menuTester.testItem(badDesc);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(nameErrMessage + "\n\n" + descErrMessage);
});

test("Also Test bad category", () => {
    let obj = menuTester.testItem(badCat);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(nameErrMessage + "\n\n" + descErrMessage + "\n\n" + catErrMessage);
});

test("Also Test bad price", () => {
    let obj = menuTester.testItem(badPrice);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(nameErrMessage + "\n\n" + descErrMessage + "\n\n" + catErrMessage+ "\n\n" + priceErrMessage);
});

test("Also Test bad image", () => {
    let obj = menuTester.testItem(badImage);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(nameErrMessage + "\n\n" + descErrMessage + "\n\n" + catErrMessage + "\n\n" + priceErrMessage + "\n\n" + imageErrMessage);
});

test("Also Test bad station", () => {
    let obj = menuTester.testItem(badStation);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(nameErrMessage + "\n\n" + descErrMessage + "\n\n" + catErrMessage + "\n\n" + priceErrMessage + "\n\n" + imageErrMessage + "\n\n" + stationErrMessage);
});