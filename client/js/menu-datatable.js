var dataSet = [];
var menuItems = [];
var time = new Date();
var categoryName = ["Main", "Side", "Beverage"];
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

$('#tableUpdateTime').html("Last Update: " + time.toLocaleString("en-us",options));

//$('#menuTable').html("Updating..");

var table;
var disableButtonClick = false; //lock for button click


var recordEditor = document.getElementById("editor-modal");
var submit = document.getElementById("submit");
var cancel = document.getElementById("cancel");
var message = document.getElementById("message");

var newName = document.getElementById("newMenuName");
var newDescription = document.getElementById("newMenuDescription");
var newCategory = document.getElementById("newMenuCategory");
var newPrice = document.getElementById("newMenuPrice");
var newMenuId = document.getElementById("newMenuId");
var updateForm = document.getElementById("updateForm");


function init() {

    table = $('#menuTable').DataTable( {
        "processing": true,
        "serverSide": false,
        "ajax": {
            "url": "/admin/getItems",
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
        var data = table.row( $(this).parents('tr') ).data();
        showRecordEditorModal(data, $(this).parents('tr'));
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

    $("#updateForm").submit(function(){

        var formData = new FormData($(this)[0]);

        $.ajax({
            url: "/admin/updateAll",
            type: 'POST',
            data: formData,
            async: true,
            success: function (response) {
                if(response.status == "success"){
                    //do this
                    message.className = "success";
                    message.innerHTML = response.msg;

                    //update the values points to by data
                    updateForm.data.name = response.data.name;
                    updateForm.data.description = response.data.description;
                    updateForm.data.price = response.data.price;
                    updateForm.data.category = response.data.category;
                    updateForm.data.image_name = response.data.image_name;

                    // console.log(table.row(event.target.origin).data());
                    table.row(updateForm.origin).invalidate();

                } else {
                    // do that
                    message.className = "error";
                    message.innerHTML = response.msg;
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });

    function updateQuery(event) {



        // console.log(newDescription.value);
        // $.ajax({
        //     url:"/admin/updateAll",
        //     type:"POST",
        //     data:{
        //         name: newName.value,
        //         price: newPrice.value,
        //         category: newCategory.value,
        //         desc: newDescription.value,
        //         station: 1, //always one.. there is only 1
        //         itemID: event.target.item_id,
        //         image: "placeholder.png"
        //     },
        //     success:function(response){
        //         if(response.status == "success"){
        //             //do this
        //             message.className = "success";
        //             message.innerHTML = response.msg;
        //
        //             //update the values points to by data
        //             event.target.data.name = response.data.name;
        //             event.target.data.description = response.data.description;
        //             event.target.data.price = response.data.price;
        //             event.target.data.category = response.data.category;
        //             event.target.data.image_name = response.data.image_name;
        //
        //             // console.log(table.row(event.target.origin).data());
        //             table.row(event.target.origin).invalidate();
        //
        //         } else {
        //             // do that
        //             message.className = "error";
        //             message.innerHTML = response.msg;
        //         }
        //
        //     }
        // });

    }



    cancel.addEventListener("click", function (event) {
        message.innerHTML = "";
        recordEditor.style.display = "none";

    });


// var newName = document.getElementById("newMenuName");
// var newDescription = document.getElementById("newMenuDescription");
// var newCategory = document.getElementById("newMenuPrice");
// var newPrice = document.getElementById("newMenuCategory");
// var newStation = document.getElementById("newMenuStation");
// var submit = document.getElementById("submit");
// var items;
//
//    submit.addEventListener("click", updateQuery);


});

function showRecordEditorModal(withData, origin) {

    message.innerHTML = "";
    newName.value= withData.name;
    newMenuId.value = withData.id;
    newDescription.value = withData.description;
    newCategory.value = withData.category;
    newPrice.value = withData.price;

    recordEditor.style.display = "block";
    submit.item_id = withData.id;
    updateForm.origin = origin;
    updateForm.data = withData;
}





