const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const session = require ("express-session");
const pg = require("pg");
const bcrypt = require("bcrypt");

var app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);

// TODO add db local url
const dbURL = process.env.DATABASE_URL;

var publicFolder = path.resolve(__dirname, "client/view");

// redirect to css and js folders
app.use("/scripts", express.static("client/build"));
app.use("/styles", express.static("client/stylesheet"))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: "dagobahfastfoodsecret",
    resave: "true",
    saveUninitialized: true
}));


app.get("/", function (req, resp){
    resp.sendFile(publicFolder + "/main.html");
});



io.on("connection", function(socket){

});


server.listen(port, function(err){
    if (err) {
        console.log(err);
        return false;
    }

    console.log("Server is running on port " + port);
});
