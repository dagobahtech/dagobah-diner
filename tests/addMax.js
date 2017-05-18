module.exports = {
	'Add maximum' : function(browser){
		browser
			.url('http://localhost:3000/order')
			.pause(2000)
			.click('#menuButton1')
			.pause(200)
			.end()
	}
}