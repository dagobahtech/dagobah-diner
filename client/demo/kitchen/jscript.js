$(document).ready(function() {
	orderNum = 0;
	curOrders = [];
	orderList = [];
	allItems = [];
	isMaking = false;
	selected = null;
	console.log("ready!");
	
	document.getElementById("one").addEventListener("click", function() {
		remove(1);
	});
	document.getElementById("two").addEventListener("click", function() {
		remove(2);
	});
	document.getElementById("six").addEventListener("click", function() {
		remove(6);
	});
	
	function remove(amount) {
		if(selected != null) {
			isMaking = true;
			document.getElementById("one").disabled = true;
			document.getElementById("two").disabled = true;
			document.getElementById("six").disabled = true;
			
			var bar = document.getElementById("foodOver");
			bar.style.transitionDuration = "5s";
			bar.style.transitionTimingFunction = "linear";
			bar.style.height = "39vh";
			
			setTimeout(function() {
				isMaking = false;
				bar.style.transitionDuration = "0.5s";
				bar.style.transitionTimingFunction = "ease";
				bar.style.height = "0";
				
				var children = selected.childNodes;
				
				children[1].innerHTML = children[1].innerHTML - amount;
				
				document.getElementById("one").disabled = false;
				document.getElementById("two").disabled = false;
				document.getElementById("six").disabled = false;
				
				fulfillOrders(selected.childNodes[0].innerHTML, amount);
			}, 5000);
			
		}
	}
	
	var temp = ["item1", "item2", "item3", "item4"]
	var temp2 = ["item3", "item4", "item5", "item6"]
	var temp3 = ["item1", "item4", "item2", "item6"]
	generate(temp);
	generate(temp);
	generate(temp2);
	generate(temp);
	generate(temp);
	generate(temp3);
	setTimeout(function() {
		generate(temp2);
	}, 1000);
	setTimeout(function() {
		generate(temp3);
	}, 2000);
	setTimeout(function() {
		generate(temp);
	}, 3000);
//	generate(temp2);
//	generate(temp);
//	generate(temp);
//	generate(temp3);
//	generate(temp);
//	generate(temp3);
//	generate(temp3);
//	generate(temp);
//	generate(temp);
	
	function generate(items) {
		curOrders.push([...items]);
		orderNum += 1;
		
		var newDiv = document.createElement("div");
		newDiv.setAttribute("ID", "order");
		
		var header = document.createElement("div");
		header.setAttribute("ID", "head");
		header.innerHTML = "Order Number: " + orderNum;
		
		var middle = document.createElement("div");
		middle.setAttribute("ID", "middle");
		
		var bottom = document.createElement("div");
		bottom.setAttribute("ID", "foot");
		bottom.innerHTML = "Time: " + 0;
		setInterval(function() {
			bottom.innerHTML = "Time: " + (parseInt(bottom.innerHTML.split(" ")[1]) + 1);
		}, 1000)
		
		document.getElementById("orders").appendChild(newDiv);
		newDiv.appendChild(header);
		newDiv.appendChild(middle);
		newDiv.appendChild(bottom);
			
		for(i = 0; i < items.length; i++) {
			
			var item = document.createElement("div");
			item.setAttribute("ID", "item");
			item.innerHTML = items[i];
			
			middle.appendChild(item);
			
			var children = document.getElementById("foodItems").childNodes;
			if(!(allItems.includes(items[i]))) {
					allItems.push(items[i]);
					generateList(items[i]);
			}
			else {
				for(x = 1; x < children.length; x++) {
					var temp = children[x].childNodes;
					if(temp[0].innerHTML == items[i]) {
						tempAmount = parseInt(temp[1].innerHTML);
						temp[1].innerHTML = tempAmount + 1;
					}	
				}
			}
		}
		orderList.push(newDiv);
	}
	function generateList(item) {
		var newDiv = document.createElement("div");
		newDiv.setAttribute("ID", "food");
		
		newDiv.addEventListener("click", function() {
			if(!isMaking) {
				this.style.border = "solid orange 2px";
				if(selected != null) {
					selected.style.border = "solid white 2px";
				}
				selected = this;
			}
		});
		
		var nameFood = document.createElement("div");
		nameFood.setAttribute("ID", "name");
		nameFood.innerHTML = item;
		
		var amt = document.createElement("div");
		amt.setAttribute("ID", "amount");
		amt.innerHTML = 1;
		
		document.getElementById("foodItems").appendChild(newDiv);
		newDiv.appendChild(nameFood);
		newDiv.appendChild(amt);
	}
	
	console.log(curOrders);
	function fulfillOrders(item, amount) {
		console.log(curOrders);
		console.log("item: " + item);
		console.log("amt: " + amount);
		//iterates through the amount of items. 
		//for each amount made, iterate through all the orders. 
		//for each order, iterate through each item
		//if match, change the item to green. 
		//then remove that item from orderlist
		//break all loops except the first one
		for(i = 0; i < amount; i++) {
			breakHere: 
			for(x = 0; x < curOrders.length; x++) {
				for(y = 0; y < curOrders[x].length; y++) {
					console.log("ITEM: " + curOrders[x][y]);
					if(curOrders[x][y] == item) {
						isDone(orderList[x].childNodes[1].childNodes[y]);
						var temp = curOrders[x].indexOf(item);
						if(temp > -1) {
							console.log("Splicing here: " + curOrders[x]);
							curOrders[x][temp] = (curOrders[x][temp]) + " done";
						}
						break breakHere;
					}
				}
			}
		}
	}
	function isDone(item) {
		item.style.color = "green";
		item.style.borderColor = "green";
		setTimeout(function() {
			item.style.transitionDuration = "60s";
			item.style.transitionTimingFunction = "linear";
			item.style.color = "red";
			item.style.borderColor = "red";
		},10);
	}
});