var dataSet = [];
var menuItems = [];
var time = new Date();
var categoryName = ["Main", "Side", "Drink"];
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
$('#tableUpdateTime').html("Last Update: " + time.toLocaleString("en-us",options));

//$('#menuTable').html("Updating..");

var table;
var disableButtonClick = false; //lock for button click

function init() {
    // $.ajax({
    //     url: "/menu-items",
    //     type: "POST",
    //     success: function(response) {
    //         for (let i = 0; i < response.length; i++){
    //             var text;
    //             if(response[i].active == true) {
    //                 text = "Enabled";
    //             } else if (response[i].active == false) {
    //                 text = "Disabled";
    //             } else {
    //                 console.log("Error");
    //             }
    //             let item = [];
    //             item.push(response[i].name);
    //             item.push(categoryName[parseInt(response[i].category) - 1]);
    //             item.push(response[i].description);
    //             item.push(response[i].kitchen_station_id);
    //             item.push(response[i].price);
    //             item.push("<button class='active' id='" + text + "'>" + text + "</button>");
    //             menuItems.push(item);
    //         }
    //         dataSet = menuItems;
    //     },
    //     async: true
    // });
    //
    // setTimeout(function() {
    //     $('#menuTable').html("");
    //     $('#menuTable').DataTable({
    //         data: dataSet,
    //         columns: [
    //             {title: 'Name'},
    //             {title: 'Category'},
    //             {title: 'Description'},
    //             {title: 'Cook Station'},
    //             {title: 'Price'},
    //             {button: ''}
    //         ],
    //         lengthMenu: [[5, 10, -1], [5, 10, "All"]]
    //     });
    //
    // }, 1000);

    table = $('#menuTable').DataTable( {
        "processing": true,
        "serverSide": false,
        "ajax": {
            "url": "menu-items",
            "type": "POST",
            "dataSrc": ""
        },

        "columns": [

            { "data": "name" },
            { "render": function(data, type, full) {
                return (categoryName[full.category - 1]);
            }},
            { "data": "description" },
            { "data": "price" },
            {"render": function ( data, type, full) {
                if(full.active) {
                    return("<button class='enabledItem' id='status-toggle' style='color:white'>Enabled</button>" +
                    " <button id='updateButton'>Update</button>")
                } else {
                    return("<button class='disabledItem' id='status-toggle' style='color:white'>Disabled</button> " +
                    "<button id='updateButton'>Update</button>")

                }
            }}
        ],
        lengthMenu: [[5, 10, -1], [5, 10, "All"]]
    } );

    $('#menuTable tbody').on( 'click', '#updateButton', function () {
        alert("updating");
    })
    //set event listeners for toggle buttons
    $('#menuTable tbody').on( 'click', '#status-toggle', function () {

        if(disableButtonClick) {return}

        disableButtonClick = true;
        var data = table.row( $(this).parents('tr') ).data();
        console.log(data);

        var button = $(this);

        $.ajax({
            url: "/admin/itemStatus",
            type: "post",
            data: {
                id: data.id
            },
            success: function (resp) {
                //resp is button status either active or inactive
                console.log(resp);
                if(resp) {
                    button.html("Enabled")
                    button.removeClass("disabledItem");
                    button.addClass("enabledItem");
                } else {
                    button.html("Disabled");
                    button.removeClass("enabledItem");
                    button.addClass("disabledItem");
                }

                data.active = resp;
                disableButtonClick = false;

                showModal("Item Active Changed", "Item's status successfully changed");

            }
        })

    } );

    $('#menuTable tbody').on( 'mouseover', '#status-toggle', function () {
        var data = table.row( $(this).parents('tr') ).data();

        var button = $(this);

        if(data.active) {
            button.html("Disable?");
        } else {
            button.html("Enable?");
        }
    });


    $('#menuTable tbody').on( 'mouseout', '#status-toggle', function () {
        var data = table.row( $(this).parents('tr') ).data();

        var button = $(this);

        if(data.active) {
            button.html("Enabled");
        } else {
            button.html("Disabled");
        }

    } );

}
$(document).ready(function(){
    init();
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

