var statusDiv = document.getElementById("statusDiv");

var nameInput = document.getElementById("nameInput");
var categoryInput = document.getElementById("categoryInput");
var descInput = document.getElementById("descriptionInput");
var priceInput = document.getElementById("priceInput");
var cookInput = document.getElementById("cookTimeInput");
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
            time: cookInput.value,
            station: stationInput.value
        },
        success: function (response) {

            if (response.status === "success") {
                statusDiv.innerHTML = response.msg;
                setTimeout(function () {
                    location.reload()
                }, 2000);
            }

            else {
                console.log(response);
                statusDiv.innerHTML = "error in response"
            }
        }
    });
});