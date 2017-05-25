
var categoryInput = document.getElementById('radioCreateItemCategory');

// document.getElementById("buttonSubmitNewItem").addEventListener("click", function() {
//     $.ajax({
//         url: "/admin/createItem",
//         type: "POST",
//         data: {
//             name: document.getElementById('inputCreateItemName').value,
//             category: categoryInput.options[categoryInput.selectedIndex].value,
//             desc: document.getElementById('inputCreateItemDesc').value,
//             price: document.getElementById('inputCreateItemPrice').value,
//             image: document.getElementById('inputCreateItemImage').value,
//             station: 1
//         },
//         success: function (response) {
//
//             if (response.status === "success") {
//                 showModal("Success", response.msg, 1);
//             }
//
//             else {
//                 showModal("Bad Input", response.msg, 1);
//             }
//         }
//     });
// });
var statusCreateItem = document.getElementById("statusCreateItem");

$("#createItemForm").submit(function(){

    var formData = new FormData($(this)[0]);

    $.ajax({
        url: "/admin/createItem",
        type: 'POST',
        data: formData,
        async: true,
        success: function (response) {
            if(response.status == "success"){
                //do this
                showModal("Item Creation", "Item Successfully Added");
                document.getElementById("createItemForm").reset();
                statusCreateItem.innerHTML = "";

            } else {
                // do that
                statusCreateItem.className = "error";
                statusCreateItem.innerHTML = response.msg;
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });

    return false;
});