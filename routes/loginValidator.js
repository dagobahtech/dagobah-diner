/**
 * Created by Brett Dixon on 2017-05-26.
 */
'use-strict'

//Username and Password regex.
const unAndPwdRegex = /^[\w]{5,15}$/;  //Letters, digits, and underscore.

//error message
const unErrMessage = "<strong>Invalid Username</strong> - Username must be must between 5 and 15 characters and only contain Alphanumeric characters and underscore.";
const pwdErrMessage = "<strong>Invalid Password</strong> - Password must be must between 5 and 15 characters and only contain Alphanumeric characters and underscore.";

class LoginValidator {

    constructor () {
        this._passing = true;
        this._errMessage = "";
    }

    _resetValid() {
        this._passing = true;
        this._errMessage = "";
    }

    testItem(login) {
        this._resetValid();
        this._testUn(login.username);
        this._testPwd(login.password);
        let obj = {
            passing : this._passing,
            err : this._errMessage
        };
        return obj;
    }

    _testUn(username) {
        if(!unAndPwdRegex.test(username)){
            this._passing = false;
            this._errMessage += unErrMessage + "<br>";
        }
    }

    _testPwd(password) {
        if(!unAndPwdRegex.test(password)){
            this._passing = false;
            this._errMessage += pwdErrMessage + "<br>";
        }
    }
}

module.exports = LoginValidator;