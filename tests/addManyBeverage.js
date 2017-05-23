module.exports = {

	'Add 3 drinks': function(browser){
		browser
			.url('http://localhost:3000/order')
			.pause(2000)
			.click("#menuButton3")
			.pause(1000)
			.click('#addButton-16')
			.pause(200)
			.click('#addButton-16')
			.pause(200)
			.click('#addButton-8')
			.pause(200)
			.click('#confirmButton')
			.pause(1000)
			.click('#yesConfirmButton')
			.pause(2000)
			.assert.urlEquals('http://localhost:3000/processing-order')
			.end()

	}
};