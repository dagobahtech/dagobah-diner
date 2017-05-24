
var oldName = document.getElementById("menuName");
var serialID = document.getElementById("menuID");
var newName = document.getElementById("newMenuName");
var newDescription = document.getElementById("newMenuDescription");
var newCategory = document.getElementById("newMenuPrice");
var newPrice = document.getElementById("newMenuCategory");
var newCookTime = document.getElementById("newMenuCookTime");
var newStation = document.getElementById("newMenuStation");
var select = document.getElementById("select");
var submit = document.getElementById("submit");

$.ajax({
	url:"/admin/sendUpdate",
	type:"post",
	data:{
		type:"request"
	},
	success:function(response){
		console.log(response.item);
	}
});


submit.addEventListener("click", updateQuery);

function updateQuery() {
	$.ajax({
		url:"/admin/updateAll",
		type:"POST",
		data:{
			oldName: oldName.value,
			serialID: serialID.value,
			newName: newName.value,
			newPrice: newPrice.value,
			newCategory: newCategory.value,
			newCookTime: newCookTime.value,
			newStation: newStation.value,
			newDescription: newDescription.value
		},
		success:function(response){
			if(response.message == "success"){
				//do this
				console.log(response);
			} else {
				// do that
				console.log(response);
			}
		}
	});

}

