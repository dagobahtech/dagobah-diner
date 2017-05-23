var statusDiv = document.getElementById("statusDiv");

var nameInput = document.getElementById("nameInput");
var categoryInput = document.getElementById("categoryInput");
var descInput = document.getElementById("descriptionInput");
var priceInput = document.getElementById("priceInput");
var imageInput = document.getElementById("imgInput");
var stationInput = document.getElementById("stationInput");

document.getElementById("submit").addEventListener("click", function() {
    $.ajax({
        url: "/admin/createItem",
        type: "POST",
        data: {
            name: nameInput.value,
            category: categoryInput.value,
            desc: descInput.value,
            price: priceInput.value,
            image: imageInput.value,
            station: stationInput.value
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