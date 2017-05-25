
var categoryInput = document.getElementById('radioCreateItemCategory');

document.getElementById("buttonSubmitNewItem").addEventListener("click", function() {
    $.ajax({
        url: "/admin/createItem",
        type: "POST",
        data: {
            name: document.getElementById('inputCreateItemName').value,
            category: categoryInput.options[categoryInput.selectedIndex].value,
            desc: document.getElementById('inputCreateItemDesc').value,
            price: document.getElementById('inputCreateItemPrice').value,
            image: document.getElementById('inputCreateItemImage').value,
            station: 1
        },
        success: function (response) {

            if (response.status === "success") {
                showModal("Success", response.msg, 1);
            }

            else {
                showModal("Bad Input", response.msg, 1);
            }
        }
    });
});