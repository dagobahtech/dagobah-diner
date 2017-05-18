module.exports = {
    'Add 1 order': function (browser) {
        browser
            .url('localhost:3000/order')
            .waitForElementVisible('body', 1000)
            .click('#addButton-2')
            .click('#confirmButton')
            .click('#yesConfirmButton')
            .pause(2000)
            .expect.elementIdElement('#orderConfirmation').to.be.an('h1')
            .end()
    }
};