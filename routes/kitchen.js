const express = require("express");
const router = express.Router();
const path = require("path");
const pool = require('../index');

/***************** ROUTE SETTINGS ********************/
//Jed - kitchen testing client
//@JED testing kitchen
var kitchenFolder = path.resolve(__dirname, "../client/kitchen-alt");
var loginForm = path.resolve(__dirname, "../client/admin/login.html");

router.get("/", function (req, resp) {
    // console.log(req.session);
    console.log(req.session.user_id);
    if (req.session.user_id == 2) {
        resp.sendFile(kitchenFolder + "/kitchen.html");
    } else {
        resp.sendFile(loginForm);
    }
});


//Server side order counter.
let startTime = new Date().getTime();
const dayInMS = 24 * 60 * 60 * 1000;  //a full day measured in millesconds.
let orderNumber = 0;
function orderNumberGenerator() {
    let currentTime = new Date().getTime();
    if (((currentTime - startTime) / dayInMS) >= 1){
        orderNumber = 1;
        startTime = new  Date().getTime();
    } else {
        orderNumber++;
    }
    return orderNumber;
}
// console.log("New Order Number: "+orderNumberGenerator());
// console.log("New Order Number: "+orderNumberGenerator());

//Discount Checker
function isDiscount (order){
    let discount = false;
    let category1 = false;
    let category2 = false;
    let category3 = false;
    for (let i = 0; i < order.items.length; i++){
        if (order.items[i].category === 1) {category1 = true;}
        if (order.items[i].category === 2) {category2 = true;}
        if (order.items[i].category === 3) {category3 = true;}
    }
    if (category1 && category2 && category3) {discount = true;}
    return discount;
}

//true Order Total
function calcTrueTotal(order, dagobah) {

    let comboDiscount = dagobah.kitchen.comboDiscount;
    var discountAmount = 0;
    let subTotal = 0;
    let total = 0;
    for (let i=0; i<order.items.length; i++){
        for(let j=0; j<dagobah.menuItems.length; j++){
            if (dagobah.menuItems[j].id === order.items[i].id){
                subTotal += order.items[i].quantity * dagobah.menuItems[j].price;
            }
        }
    }
    console.log(isDiscount(order));
    if (isDiscount(order)) {
        total = subTotal * (1 - comboDiscount);
    } else {
        total = subTotal;
    }
    order.subTotal = subTotal;
    order.total = total;
    order.comboDiscount = comboDiscount; //Jed - added this so this could be passed to client
    return order;
}
//all communication with order page happens here
//Jed - added variables for cooking
let cookTimeout;
//these values we might want to send back to client
let cookName;
let cookQuantity;


/***************** SOCKETS SETTINGS ********************/
function socketHandler(io, dagobah, kitchen) {

    io.on("connection", function(socket){

        //there should be 2 channels
        //1. Kitchen
        //2. Board
        //Server communication with customer is done via customer's socket
        socket.on("join", function (channel) {

            if(channel === undefined) {return false;}
            socket.channel = channel;
            socket.join(channel);
        });

        socket.on("get all orders", function () {
            //check if it is from the kitchen
            if(socket.channel === "kitchen") {
                io.to(socket.channel).emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders, kitchen._foodTray.items);
            }
        });

        socket.on("check open", function () {
            socket.emit("store status", dagobah.isOpen);
        });

        //kitchen client requests to do a cook function
        socket.on("cook", function (id, quantity) {
            //make sure its from the kitchen
            if(socket.channel === "kitchen") {
                //its only valid to cook is nothing is cooking ATM
                if(cookTimeout === undefined) {
                    //check if the kitchen can cook the quantity specified
                    if(kitchen.canCook(quantity)) {
                        console.log("cooking");
                        //set up an initial delay.. delay can be changed
                        //in kitchen class
                        cookTimeout = setTimeout(function () {
                            kitchen.cook(id, quantity);
                            //after cooking set the remove the timeout so other foods
                            //can be prepped
                            cookTimeout = undefined;
                            //then send back status of orders and foodtray back to kitchen client
                            io.to(socket.channel).emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders, kitchen._foodTray.items);
                            io.to(socket.channel).emit("status", false);
                            io.to("board").emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders);
                        }, kitchen.cookDelay);
                    } else {
                        //else send a message saying that the quantity is not valid
                        io.to(socket.channel).emit("problem", "invalid quantity");
                    }

                } else {
                    //something is cooking
                    io.to(socket.channel).emit("problem", "Something is already cooking");
                }
            }
        });

        //Kitchen UI requests a discard
        socket.on("discard", function (item_id, fromOrder, itemIndex, orderIndex) {
            //make sure its from the kitchen

            if(socket.channel === "kitchen") {
                kitchen.discard(fromOrder, itemIndex, orderIndex);
                if(fromOrder) {
                    io.to(socket.channel).emit("orders", kitchen._orderQueue.orders,kitchen._readyQueue.orders, kitchen._foodTray.items);
                } else {
                    io.to(socket.channel).emit("update","foodtray", kitchen._foodTray.items);
                }
            }

            let dbQuery = "INSERT INTO item_discarded (item_id) VALUES ($1)";
            pool.query(dbQuery, [item_id], function(err, result) {
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                    return false;
                }

                console.log("Db Discard Connection Ended");
                console.log(result);

            });
        });

        //Kitchen client requests a serve function
        socket.on("serve", function (index) {
            if(socket.channel === "kitchen") {
                kitchen.serve(index);
                io.to(socket.channel).emit("update","ready", kitchen._readyQueue.orders);
                io.to("board").emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders);
            }
        } );

        //Kitchen client requests for cooking status
        socket.on("status", function () {
            if(socket.channel === "kitchen") {
                if(cookTimeout) {
                    socket.emit("status", true)
                } else {
                    socket.emit("status", false);
                }
            }
        } );

        //Customer client requests for menu items
        socket.on("getItems", function(){
            socket.emit("sendData", dagobah.menuItems);
        });

        //client asks to verify order
        socket.on("verify order", function (order) {
            socket.emit("processed order", calcTrueTotal(order, dagobah));
        });
        //when order is received
        socket.on("send order", function (order) {

            let userOrderNumber;
            try{
                userOrderNumber = kitchen.addOrder(order);
            } catch(err) {
                switch(err){
                    case "Orders maxed":
                        socket.emit("ordererror", "All servers currently busy right now. Please try again later");
                        break;
                    case "empty order":
                        break;

                }

                return
            }

            if(!dagobah.isOpen) {
                socket.emit("store status", dagobah.isOpen);
                return false;
            }

            let order_date = null;
            let processedTotal = calcTrueTotal(order, dagobah);
            processedTotal.id = userOrderNumber;
            function dbInsertOrder() {

                pool.connect(function (err, client, done) {
                    if (err) {console.log(err)}
                    let dbQuery = "INSERT INTO order_submitted (total) VALUES ($1) RETURNING id, date";
                    client.query(dbQuery, [processedTotal.total], function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Result first query: ");
                        let order_id = result.rows[0].id;
                        order_date = result.rows[0].date; // create new obj key with date value
                        console.log(order_id);
                        console.log(order_date);

                        for (let i = 0; i < order.items.length; i++) {
                            let dbQuery2 = "INSERT INTO item_in_order (order_id, item_id) VALUES ($1, $2)";
                            client.query(dbQuery2, [order_id, order.items[i].id], function (err, result) {
                                if(err){
                                    console.log(err);
                                    resp.send({status: "fail"});
                                    return false;
                                }
                            });
                        }
                        done(err);
                        processedTotal.date = order_date;
                        socket.emit("orderinfo", processedTotal);
                        io.to("board").emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders);
                        console.log("Order Saved in db");
                    });
                });
            }

            // setTimeout set to 0 forces an async function
            setTimeout(dbInsertOrder, 0);


            //console.log it for now
            console.log("Log the order: ");
            console.log(order);
            console.log("Ends order log");

            //console.log it for now
            console.log(order);
            //socket.emit("orderinfo", userOrderNumber);


            io.to("kitchen").emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders, kitchen._foodTray.items);

        });

        socket.on("load orders", function(){
            io.to("board").emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders);
        });

        //client order page requests for item constraints
        socket.on("get constraints", function () {
            socket.emit("send constraints", kitchen.maxItemPerOrder, kitchen.maxQuantityPerItem);
        });
    });
}

/*************** CONSTRAINTS SETTINGS **********************/
router.post("/getConstraints", function (req, resp) {

    // this._ORDERS_MAX =20;
    // this._ORDERS_MIN =5;
    //
    // this._ITEMS_MAX = 15;
    // this._ITEMS_MIN = 1;
    //
    // this._QTY_MIN = 1;
    // this._QTY_MAX = 10;
    //
    // this._COMBO_MIN = 0;
    // this._COMBO_MAX = 30;

    let dagobah = req.app.get("dagobah");
    let kitchen = dagobah.kitchen;

    let orders = {
        min: kitchen._ORDERS_MIN,
        max: kitchen._ORDERS_MAX,
        current: kitchen.maxOrders
    };

    let itemsPerOrder = {
        min: kitchen._ITEMS_MIN,
        max: kitchen._ITEMS_MAX,
        current: kitchen.maxItemPerOrder
    };

    let qtyPerItem = {
        min: kitchen._QTY_MIN,
        max: kitchen._QTY_MAX,
        current: kitchen.maxQuantityPerItem
    };

    let comboDiscount = {
        min: kitchen._COMBO_MIN,
        max: kitchen._COMBO_MAX,
        current: kitchen.comboDiscount
    };

    resp.send({
        status: "success",
        kitchenStatus: dagobah.isOpen,
        orders,
        itemsPerOrder,
        qtyPerItem,
        comboDiscount
    });
});

router.post("/setConstraints", function (req, resp) {

    //{ orders: '10', items: '10', qty: '6', discount: '15' }
    let dagobah = req.app.get("dagobah");
    let kitchen = dagobah.kitchen;

    let success = kitchen.saveConstraints(req.body.orders, req.body.items, req.body.qty, req.body.discount);

    if(success) {
        resp.send({
            status: "success"
        })
    } else {
        resp.send({
            status: "fail"
        })
    }
});

module.exports = { router, socketHandler };
