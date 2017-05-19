/**
 * Created by Brett Dixon on 2017-05-18.
 */
module.exports = {

    'Zed Order, should reach max Orders': function(browser){
        browser
            .url('http://localhost:3000/order')
            .pause(2000)
            .click("#menuButton1")
            .pause(200)
            .click('#addButton-3')
            .pause(200)
            .click('#confirmButton')
            .pause(200)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.containsText('#orderConfirmation', 'Thank you for ordering')

            .url('http://localhost:3000/order')
            .pause(2000)
            .click("#menuButton1")
            .pause(200)
            .click('#addButton-3')
            .pause(200)
            .click('#confirmButton')
            .pause(200)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.containsText('#orderConfirmation', 'Thank you for ordering')

            .url('http://localhost:3000/order')
            .pause(2000)
            .click("#menuButton1")
            .pause(200)
            .click('#addButton-3')
            .pause(200)
            .click('#confirmButton')
            .pause(200)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.containsText('#orderConfirmation', 'Thank you for ordering')

            .url('http://localhost:3000/order')
            .pause(2000)
            .click("#menuButton1")
            .pause(200)
            .click('#addButton-3')
            .pause(200)
            .click('#confirmButton')
            .pause(200)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.containsText('#errorMessage', 'All servers currently busy right now. Please try again later')
            .end()

    }
};