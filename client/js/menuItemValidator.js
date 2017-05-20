/**
 * Created by Brett Dixon on 2017-05-19.
 */
'use-strict'

//Menu Regex Constants.
const nameRegex = /^[A-Za-z0-9' ]{3,50}$/;  //Name of Food item.
const descRegex = /^[A-Za-z0-9'\(\) ]{3,100}$/;
const priceRegex = /^[\d]{1,3}(\.\d{1,2})?$/i;  //Price (in Imperial Credits)
const catRegex = /^[1-3]$/;  //Menu category 1 - Main, 2 - Side, 3 - Beverage.
const imageRegex = /^[\w-]{1,35}.(gif|jpg|jpeg|tiff|png)$/;  //Food item image file name.

//Error Messages.
const nameErrMessage = "Bad Name - Name must be must between 3 and 50 characters and only contain Alphanumeric characters and single quotations.";
const descErrMessage = "Bad Description - Description must be must between 3 and 100 characters and only contain Alphanumeric characters, single quotations, and round brackets.";
const catErrMessage = "Bad Category - Category can only be 1, 2, or 3.";
const priceErrMessage = "Bad Price - Price must be between 0.01 and 999.99 Imperial Credits.";
const imageErrMessage = "Bad Image - Image filename must be between 1 and 35 Alphanumeric characters with no spaces.  Only png, jpg, jpeg, gif, and tiff extensions allowed.";

class MenuItemValidator {

    constructor() {
        this._passing = true;
        this._errMessage = "";
    }

    _testName(name) {
        if (!nameRegex.test(name)) {
            this._passing = false;
            this._errMessage += nameErrMessage + "\n\n";
        }
    }

    _testDesc(desc) {
        if (!descRegex.test(desc)) {
            this._passing = false;
            this._errMessage += descErrMessage + "\n\n";
        }
    }

    _testCat(category) {
        if (!catRegex.test(category)) {
            this._passing = false;
            this._errMessage += catErrMessage + "\n\n";
        }
    }

    _testPrice(price) {
        if (!priceRegex.test(price)) {
            this._passing = false;
            this._errMessage += priceErrMessage + "\n\n";
        }
    }

    _testImage(image) {
        if (!imageRegex.test(image)) {
            this._passing = false;
            this._errMessage += imageErrMessage + "\n\n";
        }
    }

    _resetValid() {
        this._passing = true;
        this._errMessage = "";
    }

    testItem(menuItem) {  //see menuItemValidator.test.js for the structure of menuItem object.
        this._resetValid();
        this._testName(menuItem.itemName);
        this._testDesc(menuItem.desc);
        this._testCat(menuItem.category);
        this._testPrice(menuItem.price);
        this._testImage(menuItem.imageName);
        let obj = {
            passing : this._passing,
            err : this._errMessage.trim()
        };
        return obj;
    }
}

module.exports = MenuItemValidator;