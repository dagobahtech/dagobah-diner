$(document).ready(function() {
    const socket = io();
    
    console.log("ready!");
    var startButton = document.getElementById("welcomeBut");
    var closedDiv = document.getElementById("closedStuff");
    
//    startButton.addEventListener("click", function() {
//       window.location.href = "/order"; 
//    });
    
    $.ajax({
        url: "/isOpen",
        type: "post",
        success: function(response) {
            console.log("response recieved: " + response);
            checkStatus(response);
        }
    });
    
    socket.on("restaurantStatus", function(status) {
       console.log("status recieved: " + status);
       checkStatus(status); 
    });
    
    function checkStatus(status) {
        console.log("checking: " + status);
        if(status == true) {
            restaurantOpen();
        }
        else if (status == false) {
            restaurantClose();
        }
        else {
            console.log("error");
        }
    }
    function restaurantOpen() {
        closedDiv.style.display = "none";
        startButton.style.display = "";
    }
    function restaurantClose() {
        closedDiv.style.display = "";
        startButton.style.display = "none";
    }
});
