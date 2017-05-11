$(document).ready(function() {
	console.log("This is ready");

	$.ajax({
		url: '/getOrderNumbers',
		type: 'GET',
		success:function(resp){
			for (var i = 0; i < resp.inProgress.length; i++) {
				console.log(resp.inProgress[i]);
				var newOrder = document.createElement("div");
				newOrder.innerHTML = resp.inProgress[i];
				newOrder.id = "orderNumber"+resp.inProgress[i];
				document.getElementById("in-Progress").appendChild(newOrder);

			}
		}
	});

	
});

// listen for updates refresh page
/*
when inprogress is ready remove from list and add to nowserving.
update inner html when done.

when order is served remove from nowserving 
update inner html when done.
*/