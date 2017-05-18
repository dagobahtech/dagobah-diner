module.exports = {

	'Add 3 drinks': function(browser){
		borwser
			.url('localhost:3000/order')
			.waitForElementVisable('body',1000)
			
	}
};