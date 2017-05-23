$(document).ready(function() {
	console.log("This is ready");

    var listInProcess = document.getElementById("ordersProcess");
    var listNowServing = document.getElementById("ordersServing");


	const socket = io();

	socket.emit("join","board");

	socket.emit("load orders");

	socket.on("orders", function(inProcess, nowServing ) {
        listInProcess.innerHTML = "";
        listNowServing.innerHTML = "";


        for (let i = 0; i < inProcess.length; i++) {
            let orderInProcess = document.createElement("li");
            orderInProcess.className = "list-group-item";
            orderInProcess.innerHTML = "Order #" + inProcess[i]._orderNumber;
            listInProcess.appendChild(orderInProcess);
        }

        for (let j = 0; j < nowServing.length; j++) {
            let orderNowServing = document.createElement("li");
            orderNowServing.className = "list-group-item";
            orderNowServing.innerHTML = "Order #" + nowServing[j]._orderNumber;
            listNowServing.appendChild(orderNowServing);
        }
	});
		
});


