$(document).ready(function() {
	selected = null;
	console.log("ready!");
	
	var foods = document.getElementsByClassName("foodStuff");
	console.log(foods);
	for(i = 0; i < foods.length; i++) {
		foods[i].addEventListener("click", function() {
			console.log(this);
			this.style.border = "solid orange 2px";
			if(selected != null) {
				selected.style.border = "solid white 2px";
			}
			selected = this;
		});
	}
	
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
			console.log(selected);
			var children = selected.childNodes;
			console.log(children[3].innerHTML);
			
			children[3].innerHTML = children[3].innerHTML - amount;
		}
	}
});