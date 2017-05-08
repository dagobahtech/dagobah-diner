/**
 * Created by Brett Dixon on 2017-05-06.
 */
$(document).ready(function() {

    console.log("kitchen_sim.js is loaded");

    burger = {
        name: "Burger",
        price: 5.00,
        time: 3
    };

    fries = {
        name: "Fries",
        price: 3.00,
        time: 2
    };

    drink = {
        name: "Drink",
        price: 1.00,
        time: 1
    };

    var orderingDiv = document.getElementById("ordering");
    var burgerButt = document.getElementById("burger");
    var friesButt = document.getElementById("fries");
    var drinkButt = document.getElementById("drink");
    var orderDiv = document.getElementById("current_order");
    var totalDiv = document.getElementById("tprice");
    var statusDiv = document.getElementById("status");
    var subButt = document.getElementById("submit");

    order = [];
    total = 0;

    function sleep(milliseconds) {
        var start = new Date().getTime();
        var x = 0;
        while ((new Date().getTime() - start) < milliseconds) {
        }
    }

    burgerButt.onclick = function() {
        var orderItem = document.createElement("div");
        orderItem.innerHTML = burger.name +"  $"+burger.price;
        order.push(burger);
        orderDiv.appendChild(orderItem);
        total += burger.price;
        totalDiv.innerHTML = "$"+total;
    };

    friesButt.onclick = function() {
        var orderItem = document.createElement("div");
        orderItem.innerHTML = fries.name +"  $"+fries.price;
        order.push(fries);
        orderDiv.appendChild(orderItem);
        total += fries.price;
        totalDiv.innerHTML = "$"+total;
    };

    drinkButt.onclick = function() {
        var orderItem = document.createElement("div");
        orderItem.innerHTML = drink.name +"  $"+drink.price;
        order.push(drink);
        orderDiv.appendChild(orderItem);
        total += drink.price;
        totalDiv.innerHTML = "$"+total;
    };

    subButt.onclick = function () {
        orderingDiv.style.display = "None";
        statusDiv.innerHTML = "Your ordering is being cooked.  Please wait patiently";
        console.log(order);
        for (var i=0; i<order.length; i++){
            var delay = order[i].time *1000;
            console.log(order[i].name+" is being cooked");
            sleep(delay);
        }

        statusDiv.innerHTML = "Your food is ready.  Thank you for waiting.";

    }

});