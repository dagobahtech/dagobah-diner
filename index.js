const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const session = require ("express-session");
const pg = require("pg");

var app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);

//import the restaurant class
const Restaurant = require("./kitchen-server/restaurant");

//initialize the restaurant
const dagobah = new Restaurant();
//just a reference to the kitchen object of the restaurant for easy access
const kitchen = dagobah.kitchen;
//declare routes
const admin = require('./routes/admin');
//@jed: I commented this out because I'll be using sockets for the kitchen
//const kitchen = require('./routes/kitchen');

// DanLi - Cloud Database Hosted on ElephantSQL.com credentials posted on GitHub
const dbURL = process.env.DATABASE_URL || "postgres://lpufbryv:FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv@stampy.db.elephantsql.com:5432/lpufbryv";


var publicFolder = path.resolve(__dirname, "client/view");

var adminFolder = path.resolve(__dirname, "client/view/admin");
var pFolder = path.resolve(__dirname, "client/public");

//TODO we can comment this out in the future. This values will be stored in the restaurant object
// lists that hold order numbers for the day
var inProgress = [];
var nowServing = [];

// redirect to css and js folders
app.use("/scripts", express.static("client/buildjs"));
app.use("/styles", express.static("client/stylesheet"));


var adminFolder = path.resolve(__dirname, "client/admin");

// redirect to image, css and js folders
app.use("/scripts", express.static("client/build"));
app.use("/styles", express.static("client/src/css"));
app.use("/images", express.static("MenuPics"));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: "dagobahfastfoodsecret",
    resave: "true",
    saveUninitialized: true
}));

//set the home folder to client/build
app.use(express.static(path.join(__dirname, "client","/build")));



// orderview get ajax
app.get("/orderview", function(req,resp) {
    resp.sendFile(pFolder+"/orderview.html");
});

app.get("/getOrderNumbers", function(req, resp){
    resp.send({
        inProgress: inProgress,
        nowServing: nowServing
    });
});

app.get("/testNowServing", function(req, resp) {
    var justServed = inProgress[0];
    nowServing.push(justServed);
    inProgress.splice(0,1);
    resp.send({
        justServed: justServed,
        nowServing: nowServing,
        inProgress: inProgress
    });
});

app.get("/testFinishOrder", function(req, resp) {
    var justServed = nowServing[0];
    nowServing.splice(0,1);
    resp.send({
        justServed: justServed,
        nowServing: nowServing,
        inProgress: inProgress
    });
});

app.use(express.static(path.join(__dirname, "client","/build")));


app.post("/admin/createItem", function(req, resp) {});

//setup the routes
app.use("/admin", admin);
//@jed: commented this, i'll be using sockets for kitchen
//app.use("/kitchen", kitchen);

/* Menu Access code section */

//var menuArray = [];     //server array of menu items to be sent to client.
var comboDiscount = 0.15;  //combo discount.  To be pulled from the database later on.

console.log("menuArray should be empty: "+ dagobah.menuItems.length);
function getMenuItems() {
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
        }
        client.query("SELECT * FROM menu", function(err, results){
                done();
                dagobah.menuItems = results.rows;
                console.log("Menu array in the server updated!");
            });
    });
}

setTimeout(function() {console.log("menuArray after getMenuItems: " + dagobah.menuItems.length)}, 2000);

exports.getMenuItems = getMenuItems(); // DL - export the function to be used in "/routes/admin.js"


//add app.get before this call
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
});

//Server side order counter.
var startTime = new Date().getTime();
const dayInMS = 24 * 60 * 60 * 1000;  //a full day measured in millesconds.
var orderNumber = 0;
function orderNumberGenerator() {
    var currentTime = new Date().getTime();
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

//true Order Total
function calcTrueTotal(order) {
    var discountAmount = 0;
    var subTotal = 0;
    var total = 0;
    for (var i=0; i<order.items.length; i++){
        for(var j=0; j<dagobah.menuItems.length; j++){
            if (dagobah.menuItems[j].id == order.items[i].id){
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

    return order;
}

//all communication with order page happens here
io.on("connection", function(socket){

	socket.on("getItems", function(){
        socket.emit("sendData", dagobah.menuItems);
	});

	//when order is received
	socket.on("send order", function (order) {

        let userOrderNumber = kitchen.addOrder(order);
		//console.log it for now
		console.log(order);
		socket.emit("orderinfo", userOrderNumber)

        order = calcTrueTotal(order);

		//send order id to customer

        console.log(userOrderNumber);
        inProgress.push(userOrderNumber);
        console.log(inProgress);

	});

    socket.on("test", function(miniTest,anything){
        console.log(miniTest);
        anything(miniTest);
    });

});


server.listen(port, function(err){
    if (err) {
        console.log(err);
        return false;
    }

    console.log("Server is running on port " + port);
});
