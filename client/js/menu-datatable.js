var time = new Date();
var categoryName = ["Main", "Side", "Drink"];
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
$('#tableUpdateTime').html("Last Update: " + time.toLocaleString("en-us",options));

$('#menuTable').html("Updating..");


var dataSet = [];
$.ajax({
    url: "/menu-items",
    type: "POST",
    success: function(response) {
        var menuItems = [];
        for (let i = 0; i < response.length; i++){
            let item = [];
            item.push(response[i].name);
            console.log(categoryName[parseInt(response[i].category) - 1]);
            item.push(categoryName[parseInt(response[i].category) - 1]);
            item.push(response[i].description);
            item.push(response[i].kitchen_station_id);
            item.push(response[i].price);
            menuItems.push(item);
        }
        dataSet = menuItems;
    },
    async: true
});

$(document).ready(function(){
    setTimeout(function() {
        $('#menuTable').html("");
        $('#menuTable').DataTable({
            data: dataSet,
            columns: [
                {title: 'Name'},
                {title: 'Category'},
                {title: 'Description'},
                {title: 'Cook Station'},
                {title: 'Price'}
            ],
            lengthMenu: [[5, 10, -1], [5, 10, "All"]]
        });
    }, 1000);
});