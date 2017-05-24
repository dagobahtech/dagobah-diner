/**
 * Created by Brett Dixon on 2017-05-18.
 */
module.exports = {

    'John Order': function(browser){
        browser
            .url('http://localhost:3000/order')
            .pause(200)
            .click("#menuButton1")
            .pause(100)
            .click('#addButton-2')
            .pause(200)
            .click('#addButton-2')
            .pause(200)
            .click('#confirmButton')
            .pause(100)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.containsText('#orderConfirmation', 'Thank You for Ordering')
            .end()

    }
};