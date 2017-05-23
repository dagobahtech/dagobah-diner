const EXPIRE_TIME = 2; // in mins

class Item {

    constructor(id, name, isDone, time) {
        this._id = id;
        this._name = name;
        this._isDone = isDone;
        this._time = time;
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }
    get isDone() {
        return this._isDone;
    }

    set time(time) {
        this._time = time;
    }

    done() {
        this._isDone = true;
        //do something with the time too here
    }

    toString() {
        return this._id + " " + this._name + " " + this._isDone + " " + this._time;
    }

    isExpired() {  //should this be added to item.js instead?

        var time = new Date().getTime();
        var diff = time - this._time;
        return (diff /60000 >= EXPIRE_TIME);
    }

}

module.exports = Item;