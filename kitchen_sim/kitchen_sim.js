/**
 * Created by Brett Dixon on 2017-05-06.
 */
$(document).ready(function() {

    console.log("kitchen_sim.js is loaded");

    comboDiscount = 0.15;

    burger = {
        name: "Burger",
        price: 5.00,
        time: 3,
        category: 1
    };

    fries = {
        name: "Fries",
        price: 3.00,
        time: 2,
        category: 2
    };

    drink = {
        name: "Drink",
        price: 1.00,
        time: 1,
        category: 3
    };

    var orderingDiv = document.getElementById("ordering");
    var burgerButt = document.getElementById("burger");
    var friesButt = document.getElementById("fries");
    var drinkButt = document.getElementById("drink");
    var orderDiv = document.getElementById("current_order");
    var totalDiv = document.getElementById("tprice");
    var comboDiv = document.getElementById("combo");
    var comboWrap = document.getElementById("combowrap");
    var subTotalDiv = document.getElementById("subprice");
    var statusDiv = document.getElementById("status");
    var subButt = document.getElementById("submit");

    order = {
        items: [],
        discount: false,
        total : 0,
        subTotal : 0
    };

    function sleep(milliseconds) {
        var start = new Date().getTime();
        var x = 0;
        while ((new Date().getTime() - start) < milliseconds) {
        }
    }

    //Discount Checker
    function isDiscount (order){
        var discount = false;
        var category1 = false;
        var category2 = false;
        var category3 = false;
        for (var i = 0; i < order.items.length; i++){
            if (order.items[i].category == 1) {category1 = true;}
            if (order.items[i].category == 2) {category2 = true;}
            if (order.items[i].category == 3) {category3 = true;}
        }
        if (category1 && category2 && category3) {discount = true;}
        return discount;
    }

    function calcTotal(order) {
        if (order.discount){
            subTotalDiv.innerHTML = "SubTotal $"+order.subTotal;
            order.total = (order.subTotal * (1 - comboDiscount)).toFixed(2);
            comboWrap.style.display = "block";
            comboDiv.innerHTML = comboDiscount*100+"% Combo Discount $"+ (order.subTotal-order.total).toFixed(2);
            totalDiv.innerHTML = "Total $"+order.total;
        } else {
            subTotalDiv.innerHTML = "SubTotal $"+order.subTotal;
            order.total = order.subTotal;
            totalDiv.innerHTML = "Total $"+order.total;
        }
    }
    
    burgerButt.onclick = function() {
        var orderItem = document.createElement("div");
        orderItem.innerHTML = burger.name +"  $"+burger.price;
        order.items.push(burger);
        orderDiv.appendChild(orderItem);
        order.subTotal += burger.price;
        order.discount = isDiscount(order);
        calcTotal(order);
    };

    friesButt.onclick = function() {
        var orderItem = document.createElement("div");
        orderItem.innerHTML = fries.name +"  $"+fries.price;
        order.items.push(fries);
        orderDiv.appendChild(orderItem);
        order.subTotal += fries.price;
        order.discount = isDiscount(order);
        calcTotal(order);
    };

    drinkButt.onclick = function() {
        var orderItem = document.createElement("div");
        orderItem.innerHTML = drink.name +"  $"+drink.price;
        order.items.push(drink);
        orderDiv.appendChild(orderItem);
        order.subTotal += drink.price;
        order.discount = isDiscount(order);
        calcTotal(order);
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