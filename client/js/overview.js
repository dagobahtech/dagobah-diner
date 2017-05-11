$(document).ready(function() {
	console.log("This is ready");

	$.ajax({
		url: '/getOrderNumbers',
		type: 'GET',
		success:function(resp){
			var arr = resp.inProgress;
			for (var i = 0; i < resp.inProgress.length; i++) {
				console.log(resp.inProgress[i]);
				var newOrder = document.createElement("div");
				newOrder.innerHTML = resp.inProgress[i];
				newOrder.id = "orderNumber"+resp.inProgress[i];
				newOrder.className = "order-Number";
				document.getElementById("in-Progress").appendChild(newOrder);

			}

			for (var x = 0; x < resp.nowServing.length; x++) {
				var serveOrder = document.createElement("div");
				serveOrder.innerHTML = resp.nowServing[x];
				serveOrder.id = "orderNumber"+resp.nowServing[x];
				serveOrder.className = "order-Number";
				document.getElementById("serving-Now").appendChild(serveOrder);
			}
			console.log(arr);
		}
	});

	function testNowServing() {
		$.ajax({
			url:'/testNowServing',
			type:'GET',
			success:function(resp){
				console.log(resp);
				
				//use jQuery remove / insert into
				//using reload for now
				location.reload();
				// var nowServe = document.createElement("div");
				// nowServe.innerHTML = resp.justServed;
				// document.getElementById("serving-Now").appendChild(nowServe);

				// var removeOrder = document.getElementById("orderNumber"+resp.justServed);
				// removeOrder.innerHTML = "";
				//remove from current list
			}

		});
	}

	function testFinishOrder() {
		$.ajax({
			url: '/testFinishOrder',
			type: 'GET',
			success:function(resp){
				console.log(resp);
				//ditto for testNowServing
				location.reload();
			}			
		});

		
	}

	document.getElementById("testServe").addEventListener("click", testNowServing,false);

	document.getElementById("testFinish").addEventListener("click", testFinishOrder,false);
	
});

// listen for updates refresh page
/*
when inprogress is ready remove from list and add to nowserving.
update inner html when done.

when order is served remove from nowserving 
update inner html when done.
*/