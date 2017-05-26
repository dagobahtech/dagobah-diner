/**
 * Created by Brett Dixon on 2017-05-26.
 */
const LoginValidator = require("./loginValidator");

//Username and Password regex.
const unAndPwdRegex = /^[\w]{5,15}$/;  //Letters, digits, and underscore.

//error messages
const unErrMessage = "<strong>Invalid Username</strong> - Username must be must between 5 and 15 characters and only contain Alphanumeric characters and underscore.";
const pwdErrMessage = "<strong>Invalid Password</strong> - Password must be must between 5 and 15 characters and only contain Alphanumeric characters and underscore.";

const bothFail = unErrMessage +"<br>"+ pwdErrMessage +"<br>";

var loginTester = new LoginValidator();

var goodLogin = {
    username : "Techbrett_1",
    password : "Jadelogin2"
};

var bigLogin = {
    username : "Techbrett_122222",
    password : "Jadelogin2"
};

var shortLogin = {
    username : "Tech",
    password : "Jade"
};

var koreanLogin = {
    username : "ㄱㅑㅘㄱㅅㅅㅅ",
    password : "ㄱㅑㅘㅅㅅㅅㅅ"
};

test("Test good login", () => {
    let obj = loginTester.testItem(goodLogin);
    expect(obj.passing).toBeTruthy();
});

test("Test too long login", () => {
    let obj = loginTester.testItem(bigLogin);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(unErrMessage+"<br>");
});

test("Test too short login", () => {
    let obj = loginTester.testItem(shortLogin);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(bothFail);
});


test("Test korean login", () => {
    let obj = loginTester.testItem(koreanLogin);
    expect(obj.passing).toBeFalsy();
    expect(obj.err).toEqual(bothFail);
});

