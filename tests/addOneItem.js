module.exports = {
    'Add 1 order': function (browser) {
        browser
            .url('localhost:3000/order')
            .pause(2000)
            .click('#addButton-2')
            .click('#confirmButton')
            .click('#yesConfirmButton')
            .pause(2000)
            .end()
    }
};