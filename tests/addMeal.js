module.exports = {
	'Add meal' : function(browser){
		browser
			.url('http://localhost:3000/order')
			.pause(2000)
			.click('#menuButton1')
			.pause(2000)
			.click('#addButton-4')
			.pause(2000)
			.click('#menuButton2')
			.pause(2000)
			.click('#addButton-15')
			.pause(2000)
			.click('#menuButton3')
			.pause(2000)
			.click('#addButton-13')
			.pause(2000)
			.click('#confirmButton')
			.pause(1000)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.urlEquals('http://localhost:3000/processing-order')
            .end()
	}
};