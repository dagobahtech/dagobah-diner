
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

submit.addEventListener("click", updateQuery);

function updateQuery() {

	if(select.value == "name"){
		console.log("yello");
		$.ajax({
			url:"/admin/updateName",
			type:"POST",
			data:{
				oldName: oldName.value,
				serialID: serialID.value,
				newName: newName.value
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
	} else if(select.value == "description"){
		$.ajax({
			url:"/admin/updateDescription",
			type:"POST",
			data:{
				oldName: oldName.value,
				serialID: serialID.value,
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
	} else if(select.value == "price"){
		$.ajax({
			url:"/admin/updatePrice",
			type:"POST",
			data:{
				oldName: oldName.value,
				serialID: serialID.value,
				newPrice: newPrice.value
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
	} else if(select.value == "category"){
		$.ajax({
			url:"/admin/updateCategory",
			type:"POST",
			data:{
				oldName: oldName.value,
				serialID: serialID.value,
				newCategory: newCategory.value
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
	} else if(select.value == "cooking"){
		$.ajax({
			url:"/admin/updateCookTime",
			type:"POST",
			data:{
				oldName: oldName.value,
				serialID: serialID.value,
				newCookTime: newCookTime.value
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
	} else if(select.value == "station"){
		$.ajax({
			url:"/admin/updateStation",
			type:"POST",
			data:{
				oldName: oldName.value,
				serialID: serialID.value,
				newStation: newStation.value
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
	} else if(select.value == "all"){
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
	} else{
		console.log("Select an option");
	}

}

