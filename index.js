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
const adminServer = require('./routes/admin');
//@jed: I commented this out because I'll be using sockets for the kitchen
const kitchenServer = require('./routes/kitchen');
//login route
const login = require("./routes/login");

// DanLi - Cloud Database Hosted on ElephantSQL.com credentials posted on GitHub
const dbURL = process.env.DATABASE_URL || "postgres://lpufbryv:FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv@stampy.db.elephantsql.com:5432/lpufbryv";

var pFolder = path.resolve(__dirname, "client/public");
var adminFolder = path.resolve(__dirname, "client/admin");
var loginForm = path.resolve(__dirname, "client/admin/login.html");

//***NOTE*** 
//remember to uncomment the line below... or modify the class somewhere
//dagobah.isOpen = false;

// redirect to css and js folders
//app.use("/buildScripts", express.static("client/buildjs"));


// redirect to image, css and js folders
app.use("/scripts", express.static("client/js"));
app.use("/styles", express.static("client/src/css"));
app.use("/images", express.static("MenuPics"));

app.use("/admin-css", express.static("client/admin/stylesheet"));
app.use("/jquery", express.static("node_modules/jquery/dist"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/chart.js", express.static("node_modules/chart.js/dist"));

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

// is restaurant open ajax call
app.post("/isOpen", function(req, resp) {
   resp.send(dagobah.isOpen);
});

//app set the pg and io so they could be used inside post and gets
app.set("dbSettings",{pg, dbURL});
app.set("socketio", io);
app.set("dagobah", dagobah);

//setup the routes
app.use("/admin", adminServer.router);
//@jed: commented this, i'll be using sockets for kitchen
app.use("/kitchen", kitchenServer.router);
//login route
app.use("/login", login);

// exports.getMenuItems = getMenuItems(); // DL - export the function to be used in "/routes/admin.js"

app.post("/menu-items", function(req, resp){
    resp.send(dagobah.menuItems);
});

app.post("/updateMenu-items", function(req, resp) {
    for(var i = 0; i < dagobah.menuItems.length; i++) {
        if(dagobah.menuItems[i].name == req.body.item) {
            var status;
            if (req.body.status == "true") {
                status = true;
            } else if (req.body.status == "false") {
                status = false;
            }
            dagobah.menuItems[i].active = status;
        }
    }
    resp.send("success");
});

//add app.get before this call
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
});

//initialize menu items
adminServer.getMenuItems(pg,dbURL, dagobah);
//start the kitchen server
kitchenServer.socketHandler(io, dagobah, kitchen, {pg, dbURL});

server.listen(port, function(err){
    if (err) {
        console.log(err);
        return false;
    }

    console.log("Server is running on port " + port);
    console.log("Welcome to Dagobah Diner.");
});

