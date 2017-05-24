/**
 * Created by Brett Dixon on 2017-05-19.
 */
'use-strict'

//Menu Regex Constants.
const nameRegex = /^[A-Za-z0-9\' ]{3,50}$/;  //Name of Food item.
const descRegex = /^[A-Za-z0-9\'\(\) ]{3,100}$/;
const priceRegex = /^[\d]{1,3}(\.\d{1,2})?$/i;  //Price (in Imperial Credits)
const catRegex = /^[1-3]$/;  //Menu category 1 - Main, 2 - Side, 3 - Beverage.
const imageRegex = /^[\w-]{1,35}.(gif|jpg|jpeg|tiff|png)$/;  //Food item image file name.
const stationRegex = /^[1-5]$/;  //Cook Station:  1 = Grill || 2 = Stove Top || 3 = Deep Fryer || 4 = Curries+Stews || 5 = Drinks

//Error Messages.
const nameErrMessage = "<strong>Bad Name</strong> - Name must be must between 3 and 50 characters and only contain Alphanumeric characters and single quotations.";
const descErrMessage = "<strong>Bad Description</strong> - Description must be must between 3 and 100 characters and only contain Alphanumeric characters, single quotations, and round brackets.";
const catErrMessage = "<strong>Bad Category</strong> - Category can only be 1, 2, or 3.";
const priceErrMessage = "<strong>Bad Price</strong> - Price must be between 0.01 and 999.99 Imperial Credits.";
const imageErrMessage = "<strong>Bad Image</strong> - Image filename must be between 1 and 35 Alphanumeric characters with no spaces.  Only png, jpg, jpeg, gif, and tiff extensions allowed.";
const stationErrMessage = "<strong>Bad Station</strong> - Station can only be 1 to 5.";

class MenuItemValidator {

    constructor() {
        this._passing = true;
        this._errMessage = "";
    }

    _testName(name) {
        if (!nameRegex.test(name)) {
            this._passing = false;
            this._errMessage += nameErrMessage + "<br>";
        }
    }

    _testDesc(desc) {
        if (!descRegex.test(desc)) {
            this._passing = false;
            this._errMessage += descErrMessage + "<br>";
        }
    }

    _testCat(category) {
        if (!catRegex.test(category)) {
            this._passing = false;
            this._errMessage += catErrMessage + "<br>";
        }
    }

    _testPrice(price) {
        if (!priceRegex.test(price)) {
            this._passing = false;
            this._errMessage += priceErrMessage + "<br>";
        }
    }

    _testImage(image) {
        if (!imageRegex.test(image)) {
            this._passing = false;
            this._errMessage += imageErrMessage + "<br>";
        }
    }

    _testStation(station) {
        if (!stationRegex.test(station)) {
            this._passing = false;
            this._errMessage += stationErrMessage + "<br>";
        }
    }

    _resetValid() {
        this._passing = true;
        this._errMessage = "";
    }

    testItem(menuItem) {  //see menuItemValidator.test.js for the structure of menuItem object.
        this._resetValid();
        this._testName(menuItem.name);
        this._testDesc(menuItem.desc);
        this._testCat(menuItem.category);
        this._testPrice(menuItem.price);
        this._testImage(menuItem.image);
        this._testStation(menuItem.station);
        let obj = {
            passing : this._passing,
            err : this._errMessage
        };
        return obj;
    }
}

module.exports = MenuItemValidator;