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
//    var restSwitch = document.getElementById("restSwitch");
//    restSwitch.addEventListener("click", function() {
//        $.ajax({
//            url: "/admin/restStatChange",
//            type: "POST",
//            data: {
//                status: restStatus
//            },
//            success: function(response) {
//                console.log("response: " + response);
//                restStatus = response;
//                checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
//            }
//        });
//    });
    
    var restBut = document.getElementById("restaurantOpenClose");
    var toggleButton = document.getElementById("toggleButton");

    restBut.addEventListener("mouseover", function() {
        checkRestStatus("Close Restaurant", "Open Restaurant", "#5cb85c", "d9534f");
    });
    restBut.addEventListener("mouseout", function() {
        checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
    });

    restBut.addEventListener("click", handleRestaurantStatusChange);

    if(toggleButton.onclick !== handleRestaurantStatusChange) {
        toggleButton.addEventListener("click", handleRestaurantStatusChange);
    }

    function handleRestaurantStatusChange(event) {
        console.log("working");
        $.ajax({
            url: "/admin/restStatChange",
            type: "POST",
            data: {
                status: restStatus
            },
            success: function(response) {
                console.log("response: " + response);
                restStatus = response;
                checkRestStatus && checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
                setConstraintSettingsStatus && setConstraintSettingsStatus(!response);
                document.getElementById("toggleButton").checked = response;
            }
        });
    }

    $.ajax({
        url: "/isOpen",
        type: "POST",
        success: function(response) {
            restStatus = response;
            checkRestStatus("Restaurant is Open", "Restaurant is Closed",  "#5cb85c", "#d9534f");
        }
    });

    function checkRestStatus(textA, textB, colorA, colorB) {
        restStatus = Boolean(restStatus);
        if(restStatus) {
//            restSwitch.checked = true;
            menuChange(textA, colorA);
        }
        else if (!restStatus) {
//            restSwitch.checked = false;
            menuChange(textB, colorB);
        }
        else {
            menuChange("Error", "white");
        }
        toggleButton.checked = restStatus;
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

    /* CONSTRAINT SETTINGS ELEMENT*/
    //spans
    var maxItemsPerOrderValue = document.getElementById("maxItemsPerOrderValue");
    var maxQtyPerItemValue = document.getElementById("maxQtyPerItemValue");
    var maxOrdersValue = document.getElementById("maxOrdersValue");
    var comboDiscountValue = document.getElementById("comboDiscountValue");

    //ranges
    var maxItemsPerOrder = document.getElementById("maxItemsPerOrder");
    var maxQtyPerItem = document.getElementById("maxQtyPerItem");
    var maxOrders = document.getElementById("maxOrders");
    var comboDiscount = document.getElementById("comboDiscount");


    //saveButton
    var saveConstraintButton = document.getElementById("saveConstraintButton");

    saveConstraintButton.addEventListener("click", function (event) {

        let orders = maxOrders.value;
        let items = maxItemsPerOrder.value;
        let qty = maxQtyPerItem.value;
        let discount = comboDiscount.value;

        $.ajax({
            url: "/kitchen/setConstraints",
            type: "post",
            data: {
                orders, items, qty, discount
            },
            success: function (resp) {
                if(resp.status==="success") {
                    showModal("Server Message", "Constraints successfully saved");
                } else {
                    showModal("Server Message", "Problem encountered when saving");
                }
            }
        })
    });

    function setMinMaxOfRange(elem, min, max) {
        if(elem === comboDiscount) {
            elem.step = 0.05;
        }
        elem.min = min;
        elem.max = max;

    }

    function setRangeValue(elem, value) {
        elem.value = value;
    }


    function setRangeEventHandler(elem, span) {
        //also initialize their values
        span.innerHTML = elem.value;

        elem.addEventListener("input", function (event) {
            span.innerHTML = event.target.value;
        });

        elem.addEventListener("change", function (event) {
            span.innerHTML = event.target.value;
        });
    }

    function setConstraintSettingsStatus(isEditable) {

        if(!document.getElementById("constraint-note")) {return;}
        maxItemsPerOrder.disabled = !isEditable;
        maxQtyPerItem.disabled = !isEditable;
        maxOrders.disabled = !isEditable;
        comboDiscount.disabled = !isEditable;
        saveConstraintButton.disabled = !isEditable;

        if(!isEditable) {
            document.getElementById("constraint-note").innerHTML = "Settings cannot be changed when restaurant is open";
        } else {
            document.getElementById("constraint-note").innerHTML = "";
        }
    }

    //set the event listeners


    $.ajax({
        url: "/kitchen/getConstraints",
        type: "post",
        success: function (resp) {
            if(resp.status === "success") {

                //resp.orders.min
                //resp.orders.max
                //resp.itemsPerOrder.min
                //resp.itemsPerOrder.max
                //resp.qtyPerItem.min
                //resp.qtyPerItem.max
                //resp.comboDiscount.min
                //resp.comboDiscount.max

                //resp.orders.current
                //resp.itemsPerOrder.current
                //resp.qtyPerItem.current
                //resp.comboDiscount.current

                setMinMaxOfRange(maxItemsPerOrder, resp.itemsPerOrder.min, resp.itemsPerOrder.max);
                setMinMaxOfRange(maxQtyPerItem, resp.qtyPerItem.min, resp.qtyPerItem.max);
                setMinMaxOfRange(maxOrders, resp.orders.min, resp.orders.max);
                setMinMaxOfRange(comboDiscount, resp.comboDiscount.min, resp.comboDiscount.max);

                setRangeValue(maxItemsPerOrder, resp.itemsPerOrder.current);
                setRangeValue(maxQtyPerItem, resp.qtyPerItem.current);
                setRangeValue(maxOrders, resp.orders.current);
                setRangeValue(comboDiscount, resp.comboDiscount.current);

                setRangeEventHandler(maxItemsPerOrder, maxItemsPerOrderValue);
                setRangeEventHandler(maxQtyPerItem, maxQtyPerItemValue);
                setRangeEventHandler(maxOrders, maxOrdersValue);
                setRangeEventHandler(comboDiscount, comboDiscountValue);

                setConstraintSettingsStatus(!resp.kitchenStatus);
            }
        }
    })

});