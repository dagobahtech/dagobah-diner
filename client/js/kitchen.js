/**
 * Created by Jed on 2017-05-17.
 */
const socket = io();
const UPDATE_FREQUENCY = 2000; //initially set to 10s. check discard every update frequency
let EXPIRE_TIME = 2; //in mins
var orderList = document.getElementById("order-list");
var orderListNodes = orderList.childNodes;

var prepItemList = document.getElementById("prep-item-list");
var prepItemListNodes = prepItemList.childNodes;
var activeItem; //pointer to the selected item

var foodTrayList = document.getElementById("food-tray-list");
var foodTrayListNodes = foodTrayList.childNodes;

var readyList = document.getElementById("ready-list");
var readyListNodes = readyList.childNodes;

//buttons
var cook1 = document.getElementById("cook1");
var cook2 = document.getElementById("cook2");
var cook6 = document.getElementById("cook6");
let selectedIndex; //save the selected index so it is preserved when new orders arrive
//ask for the the kitchen's expire time
socket.emit("expiry");
//join the kitchen socket
socket.emit("join","kitchen");
//get all the orders
socket.emit("get all orders");
//check the cooking status
socket.emit("status");
//populate the order list
socket.on("orders", updateAll);
//listener when something is discarded or served
socket.on("update", function (view, data) {
    if(view === "order") {
        updateOrders(data);
    } else if (view === "foodtray"){
        updateFoodTray(data);
    } else if (view === "ready") {
        updateReady(data);
    }
} );

//listen to expiry time change
socket.on("expiry", setExpiryTime);

function setExpiryTime(time) {
    EXPIRE_TIME = time;
}
socket.on("status", showStatus);

//preserve the button style
const buttonStyle = document.getElementById("buttons").style;

//check the foods every 2s
setInterval(checkFoods, UPDATE_FREQUENCY);

/*BUTTON ACTIONS --- COOKING*/
cook1.addEventListener("click", function () {
    cook(1);
});

cook2.addEventListener("click", function () {
    cook(2);
});

cook6.addEventListener("click", function () {
    cook(6);
});

function cook(quantity) {
    if(activeItem) {
        showStatus(true);
        socket.emit("cook", {id: parseInt(activeItem.itemId, 10), name: activeItem.itemName}, quantity);
        activeItem = undefined;
        selectedIndex = undefined;
        resetHighlight();
    }
}

/* Orders CRUD*/
//CREATING
/*ORDER LIST*/
function addOrders(orders) {

    orders.forEach(function (order, index) {
        addOrderCard(order, index);
    } )
}

function addOrderCard(order, index) {
    orderList.appendChild(createOrderCard(order, index));
}

function createOrderCard(order, index) {
    console.log(order);


    let container = document.createElement("div");
    let card = document.createElement("div");
    let cardHeader = document.createElement("div");
    let cardFooter = document.createElement("div");

    let numItems = order._items._items.length;
    let numItemsNotDone = getDoneItemsCount(order);
    let loadingBar = createLoadingBar(0, numItemsNotDone, numItems);


    container.className = "col-md-4 h-25 pb-3";
    card.className = "card item";
    cardHeader.className = "card-header";
    cardFooter.className = "card-footer text-muted";


    let itemList = createItemList(order._items._items);
    itemList.index = index;
    cardHeader.innerHTML = "Order #"+order._orderNumber;
    cardFooter.appendChild(loadingBar);
    //cardFooter.innerHTML = "Items: "+order._items._items.length;
    card.appendChild(cardHeader);
    card.appendChild(itemList);
    card.appendChild(cardFooter);
    container.appendChild(card);

    container.order = order;

    return container;
}

function createLoadingBar(minValue, currentValue, maxValue) {
    let loaderContainer = document.createElement("div");
    let loader = document.createElement("div");
    let span = document.createElement("span");

    loaderContainer.className = "progress";

    loader.setAttribute("role", "progressbar");
    loader.setAttribute("aria-valuenow", currentValue);
    loader.setAttribute("aria-valuemin", minValue);
    loader.setAttribute("aria-valuemax", maxValue)
    loader.className = "progress-bar progress-bar-striped bg-success";
    loader.role = "progressbar";
    let width = parseInt(currentValue/maxValue * 100);
    loader.style.width = width+"%";

    span.innerHTML = currentValue + "/" + maxValue+ " Done";
    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(span);
    return loaderContainer;
}
function createItemList(items, index) {

    let itemList = document.createElement("ul");
    itemList.index = index;
    itemList.className = "list-group list-group-flush auto-y-overlow";

    for(let x = 0 ; x < items.length ; x++) {
        let item = document.createElement("li");
        item.index = x;
        item.className = "list-group-item";
        console.log(items[x]);
        if(items[x]._isDone) {
            if(shouldDiscard(items[x])) {
                //add discard style if the food is beyond expire time

                appendDiscardFunction(true, item);
                item.classList.add("discard");

            } else { //else mark is at done
                item.classList.add("done");
            }
        }
        item.innerHTML = items[x]._name;
        item.food = items[x];
        itemList.appendChild(item)
    }

    return itemList;
}

/*FOODTRAY LIST*/
function createFoodTrayItem(food, index) {

    var container = document.createElement("div");

    container.className = "col-md-6";
    container.innerHTML = food._name;
    container.food = food;
    //if the food is Done
    //check the time
    if(food._isDone) {
        if(shouldDiscard(food)) {
            container.classList.add("discard")

            appendDiscardFunction(false, container);
        }
    }
    container.index = index;
    return container;
}

function populateFoodTray(foodTray) {
    foodTray.forEach(function (food, index) {
        foodTrayList.appendChild(createFoodTrayItem(food, index));
    })
}

function createReadyItem(order, index) {

    let container = document.createElement("div");
    let orderNumber = document.createElement("span");
    let serveButton = document.createElement("button");

    container.className = "col-6 col-md-2 py-1 px-0";
    orderNumber.innerHTML = "Order #" + order._orderNumber;
    orderNumber.style.paddingLeft = "5px";
    serveButton.innerHTML = "SERVE";
    serveButton.className = "btn btn-success btn-sm";

    serveButton.addEventListener("click", function () {
        socket.emit("serve", this.parentNode.index);
    });

    container.appendChild(serveButton);
    container.appendChild(orderNumber);

    container.index = index;
    container.order = order;

    return container;
}

function addReadyOrders(orders) {
    orders.forEach(function (order, index) {
        readyList.append(createReadyItem(order, index));
    } )
}

//UPDATING
function updateAll(orders, readyOrders, foodTray) {
    console.log(foodTray);
    updateOrders(orders);
    updateReady(readyOrders);
    updateFoodTray(foodTray);
}

function updateOrders(orders) {
    orderList.innerHTML = "";
    prepItemList.innerHTML = "";
    addOrders(orders);
    populatePrepList();
}

function updateReady(orders) {
    readyList.innerHTML = "";
    addReadyOrders(orders);
}
function updateFoodTray(foodTray) {
    foodTrayList.innerHTML = "";
    populateFoodTray(foodTray);
}

function checkFoods() {
    checkFoodTray();
    checkFoodOrders();
}

function checkFoodTray(){

    for(let x = 0 ; x < foodTrayListNodes.length ; x++) {
        if(!foodTrayListNodes[x].classList.contains("discard")) {
            if(shouldDiscard(foodTrayListNodes[x].food)) {
                foodTrayListNodes[x].classList.add("discard");
                appendDiscardFunction(false, foodTrayListNodes[x]);
            }
        }
    }
}

function checkFoodOrders() {

    for(let x = 0 ; x < orderListNodes.length ; x++) {
        let items = orderListNodes[x].getElementsByTagName("ul")[0].childNodes;
        for(let index = 0 ; index < items.length ; index++) {
            if(items[index].food._isDone) {
                if(!items[index].classList.contains("discard")) {
                    if(shouldDiscard(items[index].food)) {
                        items[index].classList.add("discard");
                        appendDiscardFunction(true, items[index]);
                    }
                }
            }

        }
    }
}
//DELETING


/*PREPARATIONS LIST*/
/*
 * POPULATING PREPARATION ITEMS*/
function populatePrepList() {
    let items = getUniqueItemsAsDict();
    console.log("items");
    console.log(items);
    items.forEach(function (item, index) {
        console.log(item);
        let row = document.createElement("tr");
        let dataCellName = document.createElement("td");
        let dataCellQty = document.createElement("td");
        let dataCellOrders = document.createElement("td");

        row.className = "row prep-item";
        dataCellName.className = "col-md-6";
        dataCellQty.className = "col-md-1";
        dataCellOrders.className = "col-md-5";

        row.itemId = item.itemId;
        row.itemName = item.name;
        row.inOrders = item.inOrders;
        row.index = index
        dataCellName.innerHTML = item.name;
        dataCellQty.innerHTML = item.quantity;

        item.inOrders.forEach(function (orderInfo) {
            dataCellOrders.innerHTML += " #"+orderInfo.order+"["+orderInfo.qty+"]";
        } );

        row.appendChild(dataCellName);
        row.appendChild(dataCellQty);
        row.appendChild(dataCellOrders);

        //if item is in the current order.. emphasize it
        console.log(item.inOrders);
        if(inOrderContainsOrder(item.inOrders, orderListNodes[0].order._orderNumber) !== -1) {
            console.log(orderListNodes[0].order._orderNumber);
            row.className += " current";
        }

        row.addEventListener("click", function () {
            if(activeItem) {
                activeItem.classList.remove("active-item");
            }
            this.classList.add("active-item");
            activeItem = this;
            highligthOrders(this.inOrders);
            selectedIndex = this.index;
            console.log("selected index" + selectedIndex);
        });

        prepItemList.appendChild(row);
    });

    if(selectedIndex !== undefined) {
        prepItemListNodes[selectedIndex].classList.add("active-item");
        activeItem = prepItemListNodes[selectedIndex];
    }
}


function getUniqueItemsAsDict() {
    let result = [];
    for(let x = 0 ; x < orderListNodes.length ; x++) {
        let order = orderListNodes[x].order;
        let items = order._items._items;

        items.forEach(function (item) {
            if(!item._isDone) {

                let itemIndex = itemIndexInOrders(item._id, result);
                if(itemIndex === -1) {
                    result.push({
                        itemId: item._id,
                        name: item._name,
                        quantity: 1,
                        inOrders: [{order: order._orderNumber, qty: 1}]
                    });
                } else {

                    result[itemIndex].quantity += 1;

                    let index = inOrderContainsOrder(result[itemIndex].inOrders, order._orderNumber);

                    //does not contain the order number
                    if(index === -1) {
                        result[itemIndex].inOrders.push({order: order._orderNumber, qty: 1})
                    } else {
                        result[itemIndex].inOrders[index].qty += 1;
                    }

                }
            }
        });
    }

    return result
}

function inOrderContainsOrder(inOrders, orderNumber) {
    for(let x = 0 ; x < inOrders.length ; x++) {
        if(inOrders[x].order === orderNumber){
            return x;
        }
    }
    return -1;
}

function itemIndexInOrders(itemId, list) {
    for(let x = 0 ; x < list.length ; x++) {
        let item = list[x];
        if(item.itemId === itemId) {
            return x;
        }
    }

    return -1;
}

/*HELPER FUNCTIONS*/
function shouldDiscard(food) {

    var time = new Date().getTime();
    var diff = time - food._time;
    return (diff / 60000 >= EXPIRE_TIME);
}

function appendDiscardFunction(fromOrderList, element) {
    element.addEventListener("click", function () {
        console.log("button clicked");
        socket.emit("discard", this.food._id, fromOrderList, this.index, this.parentNode.index);
    });
}

function showStatus(shouldShow) {

    var status = document.getElementById("status");
    var buttons = document.getElementById("buttons");
    console.log(buttons.style.display);
    if(shouldShow) {
        buttons.style.display = "none";
        status.style.display = "block";
    } else {
        buttons.style = buttonStyle;
        status.style.display = "none";
    }
}

function highligthOrders(orderInfoList) {
    console.log("highlight orders");
    for(let y = 0 ; y < orderListNodes.length ; y++) {

        let orderContainer = orderListNodes[y];
        let orderCard = orderContainer.childNodes[0];
        let found = false;
        for(let x = 0 ; x < orderInfoList.length ; x++) {
            if(orderInfoList[x].order === orderContainer.order._orderNumber) {
                found = true;
                break;
            }
        }
        if(found)
        {
            orderCard.classList.add("selected");
        } else {
            orderCard.classList.remove("selected");
        }
    }

}

function resetHighlight() {

    for(let x = 0 ; x < orderListNodes.length ; x++) {
        orderListNodes[x].classList.remove("selected");
    }
}

function getDoneItemsCount(order) {

    let result = 0;
    let items = order._items._items;

    for(let x = 0 ; x < items.length ; x++) {
        if(items[x]._isDone) {
            result++;
        }
    }
    return result;
}