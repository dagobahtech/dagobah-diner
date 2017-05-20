var time = new Date();
var restStatus = null;
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

$('#tableUpdateTime').html("Last Update: " + time.toLocaleString("en-us", options));

var dateArray = [];
var ordersArray = [];

var ordersDate = null;

$.ajax({
    url: "/admin/getSummary",
    type: "POST",
    success: function(response) {

        ordersDate = response.ordersDate;
        var totalOrders = 0;

        for (var i = 0; i < response.ordersDate.length; i++) {
            totalOrders += parseInt(response.ordersDate[i].orders);



            dateArray.push(response.ordersDate[i].date);
            ordersArray.push(response.ordersDate[i].orders);
        }

        $('#totalOrdersCard').html(totalOrders + " Total orders!");

    }
});


$(document).ready(function() {
    //Is the restaurant open functionality
    restBut = document.getElementById("restaurantOpenClose");

    restBut.addEventListener("mouseover", function() {
        checkRestStatus("Close Restaurant", "Open Restaurant", "#5cb85c", "d9534f");
        if(restStatus) {
            menuChange("Close Restaurant");
        }
        else if (!restStatus) {
            menuChange("Open Restaurant");
        }
        else {
            menuChange("Error", "white");
        }
    });
    restBut.addEventListener("mouseout", function() {
        checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
    });

    restBut.addEventListener("click", function() {
        console.log("working");
        $.ajax({
            url: "/restStatChange",
            type: "POST",
            data: {
                status: restStatus
            },
            success: function(response) {
                console.log(response)
                restStatus = response;
                console.log(restStatus)
                checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
            }
        });
    });

    $.ajax({
        url: "/isOpen",
        type: "POST",
        success: function(response) {
            restStatus = response;
            checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
        }
    });

    function checkRestStatus(textA, textB, colorA, colorB) {
        if(restStatus) {
            menuChange(textA, colorA);
        }
        else if (!restStatus) {
            menuChange(textB, colorB);
        }
        else {
            menuChange("Error", "white");
        }
    }

    function menuChange(text, color) {
        restBut.innerHTML = text;
        restBut.style.borderColor = color;
        restBut.style.backgroundColor = color;
    }

    var dataAreaChart = {
        labels: dateArray,
        datasets: [{
            label: "Orders",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            pointHitRadius: 10,
            data: ordersArray,
        }]
    };

    var ctx = document.getElementById("dailyOrdersChart");
    setTimeout(function() {
        var myChart = new Chart(ctx, {
            type: "line",
            data: dataAreaChart,
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                responsive:true,
                maintainAspectRatio: true
            }
        });
    }, 1000);
});