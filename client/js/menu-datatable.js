var dataSet = [];
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
            var menuItems = [];
            for (let i = 0; i < response.length; i++){
                let item = [];
                item.push(response[i].name);
                item.push(categoryName[parseInt(response[i].category) - 1]);
                item.push(response[i].description);
                item.push(response[i].kitchen_station_id);
                item.push(response[i].price);
                item.push("<button class='deleteBut'>Delete Item</button>");
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
                {title: 'Name'},
                {title: 'Category'},
                {title: 'Description'},
                {title: 'Cook Station'},
                {title: 'Price'},
                {button: ''}
            ],
            lengthMenu: [[5, 10, -1], [5, 10, "All"]]
        });
        
    }, 1000);
}
$(document).ready(function(){
    init();
    
    $('#menuTable').on( 'draw.dt', function () {
        var delButtons = document.getElementsByClassName("deleteBut");
        console.log(delButtons);
        for(i = 0; i < delButtons.length; i++) {
            delButtons[i].addEventListener("click", function() {
                console.log("working");
                console.log(this.parentNode.parentNode);
                
                //styling
                this.innerHTML = "are you sure?";
                
                this.addEventListener("click", function() {
                    console.log(this.parentNode.parentNode.childNodes[0].innerHTML);
                    var temp = this.parentNode.parentNode;
                    $.ajax({
                        url: "/admin/deleteItem",
                        type: "post",
                        data: {
                            name: this.parentNode.parentNode.childNodes[0].innerHTML
                        },
                        success: function(response) {
                            console.log(response);
                            if(response != "error") {
                                temp.remove();
                                for(x = 0; x < dataSet.length; x++) {
                                    if(dataSet[x][0] == temp.childNodes[0].innerHTML) {
                                        dataSet.splice(x, 1);
                                    }
                                }
                                //@ANYONE help
                                //@ dataTable wont update?? 
                                //i remove it but it'll redraw with removed values' 
                            }
                        }
                    });
                });
            });
        }
    });
});