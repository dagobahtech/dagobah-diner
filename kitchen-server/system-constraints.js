/**
 * Created by Brett Dixon on 2017-05-22.
 */
'use-strict';
const PropertiesReader = require('properties-reader');
const file = './kitchen-server/sys-constraints.ini';
var properties = PropertiesReader(file);


class SysConstraints {

    constructor() {
        var properties = PropertiesReader(file);
        this._comboDiscount = properties.get('main.comboDiscount');
        this._cookTime = properties.get('main.cookTime');
        this._maxOrders = properties.get('main.maxOrders');
        this._maxPerItem = properties.get('main.maxPerItem');
        this._discardTime = properties.get('main.discardTime');
        this._numConstrains = properties.length;
    }

    get comboDiscount() {
        return this._comboDiscount;
    }

    set comboDiscount(value) {
        properties.set('main.comboDiscount', value);
        this._comboDiscount = properties.get('main.comboDiscount');
    }

    get cookTime() {
        return this._cookTime;
    }

    set cookTime(value) {
        properties.set('main.cookTime', value);
        this._cookTime = properties.get('main.cookTime');
    }

    get maxOrders() {
        return this._maxOrders;
    }

    set maxOrders(value) {
        properties.set('main.maxOrders', value);
        this._maxOrders = properties.get('main.maxOrders');
    }

    get maxPerItem() {
        return this._maxPerItem;
    }

    set maxPerItem(value) {
        properties.set('main.maxPerItem', value);
        this._maxPerItem = properties.get('main.maxPerItem');
    }

    get discardTime() {
        return this._discardTime;
    }

    set discardTime(value) {
        properties.set('main.discardTime', value);
        this._discardTime = properties.get('main.discardTime');
    }

    get numConstrains() {
        return this._numConstrains;
    }

}

module.exports = SysConstraints;