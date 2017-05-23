module.exports = {
	'Add meal' : function(browser){
		browser
			.url('http://localhost:3000/order')
			.pause(200)
			.click('#menuButton1')
			.pause(200)
			.click('#addButton-4')
			.pause(200)
			.click('#menuButton2')
			.pause(200)
			.click('#addButton-15')
			.pause(200)
			.click('#menuButton3')
			.pause(200)
			.click('#addButton-13')
			.pause(200)
			.click('#confirmButton')
			.pause(1000)
            .click('#yesConfirmButton')
            .pause(2000)
            .assert.urlEquals('http://localhost:3000/processing-order')
            .end()
	}
};