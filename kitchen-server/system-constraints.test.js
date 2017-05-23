/**
 * Created by Brett Dixon on 2017-05-22.
 */
const SysConstraints = require('./system-constraints');

var newConstraints = new SysConstraints();
var initialValues = {
    comboDiscount : newConstraints.comboDiscount,
    cookTime : newConstraints.cookTime,
    maxOrders : newConstraints.maxOrders,
    maxPerItem : newConstraints.maxPerItem,
    discardTime : newConstraints.discardTime
};

beforeAll(() => {
    return newConstraints;
});

test("Can read file", () => {
    expect(newConstraints.numConstrains).toEqual(5);
});

test("Can set discount", () => {
    newConstraints.comboDiscount = 0.01;
    expect(newConstraints.comboDiscount).toEqual(0.01);
});

test("Can set cook time", () => {
    newConstraints.cookTime = 6000;
    expect(newConstraints.cookTime).toEqual(6000);
});

test("Can set max orders", () => {
    newConstraints.maxOrders = 11;
    expect(newConstraints.maxOrders).toEqual(11);
});

test("Can set max quantity per item", () => {
    newConstraints.maxPerItem = 7;
    expect(newConstraints.maxPerItem).toEqual(7);
});

test("Can set discard time", () => {
    newConstraints.discardTime = 3000;
    expect(newConstraints.discardTime).toEqual(3000);
});

afterAll(() => {
    newConstraints.comboDiscount = initialValues.comboDiscount;
    newConstraints.cookTime = initialValues.cookTime;
    newConstraints.maxOrders = initialValues.maxOrders;
    newConstraints.maxPerItem = initialValues.maxPerItem;
    newConstraints.discardTime = initialValues.discardTime;
    console.log(newConstraints.comboDiscount);
    console.log(newConstraints.cookTime);
    console.log(newConstraints.maxOrders);
    console.log(newConstraints.maxPerItem);
    console.log(newConstraints.discardTime);
    return newConstraints;
});