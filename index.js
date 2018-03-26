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


// DanLi - Cloud Database Pool config
var dbConfig = {
    user: 'lpufbryv',
    database: 'lpufbryv',
    password: 'FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv',
    host: 'stampy.db.elephantsql.com',
    port: 5432,
    max: 5,
    idleTimeoutMillis: 30000
};
const pool = new pg.Pool(dbConfig);
const dbURL = process.env.DATABASE_URL || "postgres://lpufbryv:FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv@stampy.db.elephantsql.com:5432/lpufbryv";

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

//export the 'query' method for passing queries to the pool
module.exports.query = function (text, values, callback) {
    return pool.query(text, values, callback);
};
//export 'connect' method to borrow client from pool
module.exports.connect = function (callback) {
    return pool.connect(callback);
};


var pFolder = path.resolve(__dirname, "client/public");

//***NOTE*** 
//remember to uncomment the line below... or modify the class somewhere
//dagobah.isOpen = false;

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

//add app.get before this call
//add a middle to check if store is open or close
app.get('*', handleOrderPage, function (request, response){
    response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
});

function handleOrderPage(req, resp, next) {
    console.log(req.url);
    if(req.url === '/order' || req.url === '/order-processing') {
        console.log("check order page");
        if(dagobah.isOpen) {
            next();
        } else {
            resp.redirect("/");
        }
    }
}
//initialize menu items
adminServer.getMenuItems(dagobah);
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

