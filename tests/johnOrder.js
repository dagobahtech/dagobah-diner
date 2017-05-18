/**
 * Created by Brett Dixon on 2017-05-18.
 */
module.exports = {

    'John Order': function(browser){
        browser
            .url('localhost:3000/order')
            .pause(2000)
            .click("#menuButton1")
            .pause(1000)
            .click('#addButton-2')
            .pause(200)
            .click('#addButton-2')
            .pause(200)
            .click('#confirmButton')
            .pause(1000)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.containsText('#orderConfirmation', 'Thank you for ordering')
            .end()

    }
};