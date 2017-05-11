const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const session = require ("express-session");
const pg = require("pg");

var app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);

//declare routes
const admin = require('./routes/admin');
const kitchen = require('./routes/kitchen');

// DanLi - Cloud Database Hosted on ElephantSQL.com credentials posted on GitHub
const dbURL = process.env.DATABASE_URL || "postgres://lpufbryv:FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv@stampy.db.elephantsql.com:5432/lpufbryv";


var publicFolder = path.resolve(__dirname, "client/view");

var adminFolder = path.resolve(__dirname, "client/view/admin");
var pFolder = path.resolve(__dirname, "client/public");

// lists that hold order numbers for the day
var inProgress = [];
var nowServing = [];


// redirect to css and js folders
app.use("/scripts", express.static("client/buildjs"));
app.use("/styles", express.static("client/stylesheet"));


var adminFolder = path.resolve(__dirname, "client/admin");


// redirect to image, css and js folders
app.use("/scripts", express.static("client/build"));
app.use("/styles", express.static("client/stylesheet"));
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
app.use("/kitchen", kitchen);


/* Menu Access code section */
var menuArray = [];     //server array of menu items to be sent to client.

console.log("menuArray should be empty: "+ menuArray.length);
function getMenuItems() {
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
        }
        client.query("SELECT * FROM menu", function(err, results){
                done();
                menuArray = results.rows;
                console.log("Menu array in the server updated!");
            });
    });
}

setTimeout(function() {console.log("menuArray after getMenuItems: " + menuArray.length)}, 2000);

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

//all communication with order page happens here
io.on("connection", function(socket){

	socket.on("getItems", function(){
        socket.emit("sendData", menuArray);
	});

	//when order is received
	socket.on("send order", function (order) {
		//console.log it for now
		console.log(order);
		//send order id to customer
        var userOrderNumber = orderNumberGenerator();
        console.log(userOrderNumber);
        inProgress.push(userOrderNumber);
        console.log(inProgress);

	});
});


server.listen(port, function(err){
    if (err) {
        console.log(err);
        return false;
    }

    console.log("Server is running on port " + port);
});
