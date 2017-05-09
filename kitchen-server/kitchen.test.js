var sum = require("./sum");
var Kitchen = require('./kitchen');


test('Checking if item is succesfully added to order queue', () => {
    var kitchen = new Kitchen();
    var item = {
        items: ['fries', 'burger'],
        total: 12
    };

    kitchen.addOrderToQueue(item);
    expect(kitchen.getNextOrder()).toBe(item);
});