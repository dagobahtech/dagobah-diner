const express = require("express");
const router = express.Router();
const pg = require("pg");
const path = require("path");
var rootFile = require("../index.js");

const dbURL = process.env.DATABASE_URL || "postgres://lpufbryv:FGc7GtCWBe6dyop0yJ2bu0pTXDoBJnEv@stampy.db.elephantsql.com:5432/lpufbryv";
var adminFolder = path.resolve(__dirname, "../client/admin");
var loginForm = path.resolve(__dirname, "../client/admin/login.html");


router.get("/", function (req, resp) {
    if (req.session.user_id === 1) {
        resp.sendFile(adminFolder + "/index.html");
    } else {
        resp.redirect("/login");
    }
});

router.post("/page/:page", function (req, resp) {
    resp.sendFile(adminFolder+"/"+req.params.page+".html");
});

router.get("/logout", function(req, resp) {
    req.session.destroy();

    resp.redirect("/login");

});

router.post("/createItem", function (req, resp) {
    console.log(req.body);

    pg.connect(dbURL, function(err, client, done) {
        if (err) {console.log(err)}

        let dbQuery = "INSERT INTO menu (name, category, description, price, cook_time, kitchen_station_id) VALUES ($1, $2, $3, $4, $5, $6)";
        client.query(dbQuery, [req.body.name, req.body.category, req.body.desc, req.body.price, req.body.time, req.body.station], function(err, result) {
            done();
            if (err) {
                console.log(err);
                resp.end("ERROR");
            }

            rootFile.getMenuItems();
            resp.send({status: "success", msg: "item created!"})

        });
    });
});

router.post("/getSummary", function(req, resp) {

    let summary = {};

    pg.connect(dbURL, function(err, client, done) {
        if(err){console.log(err)}

        let dbQuery = "SELECT to_char(date AT TIME ZONE 'MST', 'YYYY-MM-DD') as date, COUNT(id) AS orders FROM order_submitted GROUP BY to_char(date AT TIME ZONE 'MST', 'YYYY-MM-DD') ORDER BY date;";
        client.query(dbQuery,[], function(err, result){
            done();
            if(err){console.log(err)}

            summary.ordersDate = result.rows;

            resp.send(summary);
        });
    });
});

//statistics post
router.post("/getStatData", function (req, resp) {

    let category = req.body.category;
    let year = req.body.year;
    let type = req.body.type;

    pg.connect(dbURL, function(err, client, done) {
        if(err){console.log(err)}

        let dbQuery;
        let params;
        if(category === 'yearly') {
            if(type === 'sales') {
                dbQuery = "SELECT EXTRACT (YEAR FROM date) as category, SUM(total) as value from order_submitted GROUP BY EXTRACT (YEAR FROM date)";
            } else {
                dbQuery = "SELECT EXTRACT (YEAR FROM item_discarded.date) as category, SUM(menu.price) as value FROM item_discarded, menu where item_discarded.item_id = menu.id GROUP BY EXTRACT (YEAR FROM item_discarded.date)"
        }
        params = [];
        } else if(category === 'monthly') {
            if(type === 'sales') {
                dbQuery = "SELECT EXTRACT (MONTH FROM date) as category, SUM(total) as value FROM order_submitted WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (MONTH FROM date)";
            } else {
                dbQuery = "SELECT EXTRACT (MONTH FROM item_discarded.date) as category, SUM(menu.price) as value FROM item_discarded, menu where item_discarded.item_id = menu.id AND EXTRACT (YEAR FROM item_discarded.date) = $1 GROUP BY EXTRACT (MONTH FROM item_discarded.date)"
            }
            params = [year];
        } else if(category === 'weekly') {
            if(type === 'sales') {
                dbQuery = "SELECT EXTRACT (WEEK FROM date) as category, SUM(total) as value from order_submitted WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (WEEK FROM date)";
            } else {
                dbQuery = "SELECT EXTRACT (WEEK FROM item_discarded.date) as category, SUM(menu.price) as value FROM item_discarded, menu where item_discarded.item_id = menu.id AND EXTRACT (YEAR FROM item_discarded.date) = $1 GROUP BY EXTRACT (WEEK FROM item_discarded.date)"
            }
            params = [year];
        } else {
            done();
            return false;
        }
        //if can't make the query, don't continue
        if(dbQuery === undefined) {
            done();
            resp.send({
                status: "fail"
            });
            return false;
        }
        client.query(dbQuery,params, function(err, result){
            done();
            if(err){console.log(err)}

            resp.send({
                status: "success",
                data: result.rows,
                category: category,
                type: type
            });
        });
    });
});
module.exports = router;