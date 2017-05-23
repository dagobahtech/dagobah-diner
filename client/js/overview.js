$(document).ready(function() {
	console.log("This is ready");


	const socket = io();

	socket.emit("join","board");

	socket.emit("load orders");

	socket.on("orders", function(orders, ready){
		console.log(orders);
		console.log(ready);


	});
		
});


