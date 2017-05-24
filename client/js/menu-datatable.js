var dataSet = [];
var menuItems = [];
var time = new Date();
var categoryName = ["Main", "Side", "Drink"];
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
$('#tableUpdateTime').html("Last Update: " + time.toLocaleString("en-us",options));

$('#menuTable').html("Updating..");

function init() {
    $.ajax({
        url: "/menu-items",
        type: "POST",
        success: function(response) {
            for (let i = 0; i < response.length; i++){
                var text;
                if(response[i].active == true) {
                    text = "Enabled";
                } else if (response[i].active == false) {
                    text = "Disabled";
                } else {
                    console.log("Error");
                }
                let item = [];
                item.push(response[i].id);
                item.push(response[i].name);
                item.push(categoryName[parseInt(response[i].category) - 1]);
                item.push(response[i].description);
                item.push(response[i].kitchen_station_id);
                item.push(response[i].price);
                item.push("<button class='active' id='" + text + "'>" + text + "</button>");
                item.push("<button class='updateBut'>Update Item</button>");
                menuItems.push(item);
            }
            dataSet = menuItems;
        },
        async: true
    });
    
    setTimeout(function() {
        $('#menuTable').html("");
        $('#menuTable').DataTable({
            data: dataSet,
            columns: [
                {title: 'ID'},
                {title: 'Name'},
                {title: 'Category'},
                {title: 'Description'},
                {title: 'Cook Station'},
                {title: 'Price'},
                {button: ''},
                {button: ''}
            ],
            lengthMenu: [[5,-1], [5,"All"]]
        });
        
    }, 1000);
}
$(document).ready(function(){
    init();
    
    $('#menuTable').on( 'draw.dt', function () {
        var modifyButtons = document.getElementsByClassName("updateBut");
        console.log(modifyButtons);

        for(y = 0; y < modifyButtons.length; y++){
            modifyButtons[y].addEventListener("click", function(){
                this.addEventListener("click", function(){
                    var menuCat = this.parentNode.parentNode.childNodes[2].innerHTML;
                    if(menuCat == "Main"){
                        menuCat = 1;
                    } else if (menuCat == "Side"){
                        menuCat = 2;
                    } else {
                        menuCat = 3;
                    }
                    $.ajax({
                        url:"/admin/sendUpdate",
                        type:"post",
                        data:{
                            type: "recieved",
                            itemID: this.parentNode.parentNode.childNodes[0].innerHTML,
                            name: this.parentNode.parentNode.childNodes[1].innerHTML,
                            category: menuCat,
                            desc: this.parentNode.parentNode.childNodes[3].innerHTML,
                            price: this.parentNode.parentNode.childNodes[5].innerHTML,
                            image: "placeholder.png",
                            station: this.parentNode.parentNode.childNodes[4].innerHTML
                        },
                        success:function(response){
                            console.log(response);
                            document.getElementById("addUpdateBlock").style.display = "block";
                            $.ajax({
                                url:"/admin/sendUpdate",
                                type:"post",
                                data:{
                                    type:"request"
                                },
                                success:function(response){
                                    console.log(response.item);
                                    items = response.item;
                                    newName.value = items.name;
                                    newDescription.value = items.desc;
                                    newCategory.value = items.category;
                                    newPrice.value = items.price;
                                    newStation.value = items.station;

                                }
                            });

                        }
                    });
                });
            });
        }

        var active = document.getElementsByClassName("active");
        for(i = 0; i < active.length; i++) {
            active[i].addEventListener("click", function() {
                this.disabled = true;
                console.log("working");
                var temp = this;
                var itemName = this.parentNode.parentNode.childNodes[1].innerHTML;
                var isEnabled = this.innerHTML;
                if(isEnabled == "Disable?") {
                    isEnabled = true;
                } else if (isEnabled == "Enable?") {
                    isEnabled = false;
                }
                $.ajax({
                    url: "/admin/itemStatus",
                    type: "post",
                    data: {
                        item: itemName,
                        status: isEnabled
                    },
                    success: function(response) {
                        
                        console.log(response);
                        
                        var text;
                        if(response.status == true) {
                            text = "Enabled";
                            console.log(text)
                        } else if (response.status == false) {
                            text = "Disabled";
                            console.log(text)
                        } else {
                            console.log("Error");
                        }
                        console.log(this);
                        temp.disabled = false;
                        temp.id =  text;
                        temp.innerHTML = text;
                        
                        $.ajax({
                           url: "/admin/updateMenu-items",
                            type: "post",
                            data: {
                                item: response.item,
                                status: response.status
                            },
                            success: function(response) {
                                console.log(response);
                            }
                        });
                        
                        for(i = 0; i < dataSet.length; i++) {
                            if(dataSet[i][1] == response.item) {
                                console.log(dataSet);
                                console.log("doing this");
                                dataSet[i][5] = "<button class='active' id='" + text + "'>" + text + "</button>"
                                menuItems[i][5] = "<button class='active' id='" + text + "'>" + text + "</button>"
                            }
                        }
                    }
                });
                showModal("Success!", "Item updated", 1);
            });
            
            active[i].addEventListener("mouseover", function() {
                if(this.innerHTML == "Enabled") {
                    this.innerHTML = "Disable?";
                } else if (this.innerHTML == "Disabled") {
                    this.innerHTML = "Enable?";
                }
            });
            active[i].addEventListener("mouseout", function() {
                if(this.innerHTML == "Disable?") {
                    this.innerHTML = "Enabled";
                } else if (this.innerHTML == "Enable?") {
                    this.innerHTML = "Disabled";
                }
            });
        }
    });
    
    
});


var newName = document.getElementById("newMenuName");
var newDescription = document.getElementById("newMenuDescription");
var newCategory = document.getElementById("newMenuPrice");
var newPrice = document.getElementById("newMenuCategory");
var newStation = document.getElementById("newMenuStation");
var submit = document.getElementById("submit");
var items;




submit.addEventListener("click", updateQuery);

function updateQuery() {
    $.ajax({
        url:"/admin/updateAll",
        type:"POST",
        data:{
            name: newName.value,
            price: newPrice.value,
            category: newCategory.value,
            station: newStation.value,
            desc: newDescription.value,
            itemID: items.itemID,
            image: "placeholder.png"
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

