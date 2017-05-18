module.exports = {
    'Add 1 order': function (browser) {
        browser
            .url('http://localhost:3000/order')
            .pause(2000)
            .click('#addButton-2')
            .pause(1000)
            .click('#confirmButton')
            .pause(1000)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.urlEquals('http://localhost:3000/processing-order')
            .end()
    }
};