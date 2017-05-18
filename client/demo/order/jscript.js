function startOrder() {
	console.log("starting!");
	var card1 = document.getElementById("card1");
	card1.style.paddingTop = "40vh";
	document.getElementById("outer2").style.opacity = 1;
	document.getElementById("title").style.marginTop = "-100vh";
}
function move(self) {
	console.log(self);
	document.getElementById("title").style.marginTop = "-200vh";
	var card1 = document.getElementById("card1");
	generate();
}
function generate() {
	var words = ["words","more","baby","scream","???","yoda","just eat yoda", "uhm", "food", "number 10", "mouseman", "temp", "a bee", "?????????", "fifteen", "electricty", "ugh", "afsdjlkjfd", "9", "two ten"];
	var cont = document.getElementById("food");
	cont.style.paddingTop = 0;
	for(i = 0; i < words.length; i++) {
		console.log("generating...");
		var newDiv = document.createElement("div");
		newDiv.setAttribute("ID", "foodItem");		
		newDiv.style.opacity = 1;
		newDiv.innerHTML = words[i];
		newDiv.setAttribute("onclick", "doThis(this)");
//		newDiv.addEventListener("click", function() {
//
//		});
		cont.appendChild(newDiv);
	}
}
function doThis(self) {
	var addItem = document.createElement("div");
	addItem.setAttribute("ID", "orderList");
	
	var text = document.createElement("div");
	text.setAttribute("ID", "text");
	text.innerHTML = self.innerHTML;
	addItem.appendChild(text);
		
	var newBut = document.createElement("button");
	newBut.innerHTML = "Delete Item";
	newBut.setAttribute("ID", "delete");
	addItem.appendChild(newBut);
	newBut.setAttribute("onclick", "del(this)");
	
	document.getElementById("items").appendChild(addItem);
	
	setTimeout(function() {
		addItem.style.marginTop = "0.5vw";
		addItem.style.opacity = 1;
	}, 0);
}
function del(self) {
	console.log(self.parentElement);
	document.getElementById("items").removeChild(self.parentElement);
}
$(document).ready(function() {
	console.log("ready!");
	
	var but1 = document.getElementById("opt1");
	var but2 = document.getElementById("opt2");
	
	but1.addEventListener("mouseover", function() {
		but1.style.width = "30vw";
		but2.style.width = "0";
		but2.style.fontSize = 0;
//		but2.style.padding = 0;
	});
	but1.addEventListener("mouseout", function() {
		but1.style.width = "15vw";
		but2.style.width = "15vw";
		but2.style.fontSize = "1.7vw";
//		but2.style.padding = "1vw";
	});
	
	but2.addEventListener("mouseover", function() {
		but2.style.width = "30vw";
		but1.style.width = "0";
		but1.style.fontSize = 0;
//		but2.style.padding = 0;
	});
	but2.addEventListener("mouseout", function() {
		but2.style.width = "15vw";
		but1.style.width = "15vw";
		but1.style.fontSize = "1.7vw";
//		but2.style.padding = "1vw";
	});
});