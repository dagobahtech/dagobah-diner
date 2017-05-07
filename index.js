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

// DanLi - Cloud Database Hosted on ElephantSQL.com credentials posted on GitHub
const dbURL = process.env.DATABASE_URL || "postgres://lpufbryv:FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv@stampy.db.elephantsql.com:5432/lpufbryv";

var publicFolder = path.resolve(__dirname, "client/view");
var adminFolder = path.resolve(__dirname, "client/view/admin");

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

app.use(express.static(path.join(__dirname, "client","/build")));

app.get("/admin", function(req, resp) {
    resp.sendFile(adminFolder + "/admin.html");
});

app.post("/admin/createItem", function(req, resp) {

    console.log(req.body);

    pg.connect(dbURL, function(err, client, done) {
        if (err) {
            console.log(err);
        }

        var dbQuery = "INSERT INTO menu (name, category, description, price, cook_time, kitchen_station_id) VALUES ($1, $2, $3, $4, $5, $6)";
        client.query(dbQuery, [req.body.name, req.body.category, req.body.desc, req.body.price, req.body.time, req.body.station], function(err, result) {
            done();
            if (err) {
                console.log(err);
                resp.end("ERROR");
            }

            resp.send({status: "success", msg: "item created!"})

        });
    });
});

io.on("connection", function(socket){
	socket.on("getItems", function(){
		console.log("connected database");
		pg.connect(dbURL, function(err, client, done){
			if(err){
				consoloe.log(err);
			} else {
				client.query("SELECT * FROM menu", function(err, results){
					done();
					console.log(results.rows);
					socket.emit("sendData", results.rows);
				});
			}

		});

	});

});


server.listen(port, function(err){
    if (err) {
        console.log(err);
        return false;
    }

    console.log("Server is running on port " + port);
});
