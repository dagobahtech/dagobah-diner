'use-strict';

const Kitchen = require("./kitchen");

class Store {

    constructor() {
        this._open = true; //should initially be false
        this._kitchen = new Kitchen();
    }

    get isOpen() {
        return this._open;
    }

    set isOpen(status) {
        if(typeof(status) === 'boolean') {
            this._open = status
        }

        if(status === false) {
            this._kitchen.reset();
        }
    }

    get kitchen() {
        return this._kitchen;
    }
}

module.exports = Store;
