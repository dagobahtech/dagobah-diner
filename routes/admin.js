const express = require("express");
const router = express.Router();
const pg = require("pg");
const path = require("path");
const MenuItemValidator = require("./menuItemValidator");
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

var menuTester = new MenuItemValidator();

router.post("/createItem", function (req, resp) {
    console.log(req.body);
    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "INSERT INTO menu (name, category, description, price, image_name, kitchen_station_id) VALUES ($1, $2, $3, $4, $5, $6)";
            client.query(dbQuery, [req.body.name, req.body.category, req.body.desc, req.body.price, req.body.image, req.body.station], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item created!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }

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

    if(category === undefined) {
        resp.send({
            status: "fail"
        })
    }
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
            if(year === undefined) {
                resp.send({
                    status: "fail"
                });
                done();
                return;
            }
            if(type === 'sales') {
                dbQuery = "SELECT EXTRACT (MONTH FROM date) as category, SUM(total) as value FROM order_submitted WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (MONTH FROM date)";
            } else {
                dbQuery = "SELECT EXTRACT (MONTH FROM item_discarded.date) as category, SUM(menu.price) as value FROM item_discarded, menu where item_discarded.item_id = menu.id AND EXTRACT (YEAR FROM item_discarded.date) = $1 GROUP BY EXTRACT (MONTH FROM item_discarded.date)"
            }
            params = [year];
        } else if(category === 'weekly') {
            if(year === undefined) {
                resp.send({
                    status: "fail"
                });
                done();
                return;
            }
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

router.post("/getOrderStat", function (req, resp) {

    let year = req.body.year;

    if(year === undefined) {
        resp.send({
            status: "fail"
        })
    }

    pg.connect(dbURL, function (err, client, done) {
        if(err) {
            console.log(err);
            return false;
        }

        client.query("SELECT EXTRACT (MONTH FROM date) AS category, COUNT(*) AS value from order_submitted WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (MONTH FROM date)",
        [year], function (err, result) {
                done();
                if(err) {
                    console.log(err);
                    resp.send({
                        status: "fail"
                    });
                    return false;
                }

                resp.send({
                    status: "success",
                    data: result.rows
                });

            });
    })
});

router.post("/getDiscardStat", function (req, resp) {

    let year = req.body.year;

    if(year === undefined) {
        resp.send({
            status: "fail"
        })
    }
    pg.connect(dbURL, function (err, client, done) {
        if(err) {
            console.log(err);
            return false;
        }

        client.query("SELECT EXTRACT (WEEK FROM date) AS category, COUNT(*) AS value from item_discarded WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (WEEK FROM date)",
            [year], function (err, result) {
                done();
                if(err) {
                    console.log(err);
                    resp.send({
                        status: "fail"
                    });
                    return false;
                }

                resp.send({
                    status: "success",
                    data: result.rows
                });

            });
    })
});

router.post("/getOrderAvgStat", function (req, resp) {

    let year = req.body.year;

    if(year === undefined) {
        resp.send({
            status: "fail"
        })
    }

    pg.connect(dbURL, function (err, client, done) {
        if(err) {
            console.log(err);
            return false;
        }
        client.query("SELECT EXTRACT (MONTH FROM date) AS category, ROUND(AVG(count),2) AS value from " +
            "(SELECT order_submitted.id AS id, count(*) AS count, order_submitted.date AS date " +
            "from order_submitted, item_in_order WHERE order_submitted.id = item_in_order.order_id " +
            "AND EXTRACT (YEAR FROM order_submitted.date) = $1 GROUP BY order_submitted.id) " +
            "AS order_table GROUP BY EXTRACT (MONTH FROM date);",
            [year], function (err, result) {
            done();
            if(err) {
                console.log(err);
                return false;
            }

            resp.send({
                status: "success",
                data: result.rows
            });


        })
    });
});

router.post("/getItemStatAll", function (req, resp) {
    let year = req.body.year;
    let category = req.body.category;

    if(year === undefined || category === undefined) {
        resp.send({
            status: "fail"
        });

        return;
    }

    pg.connect(dbURL, function (err, client, done) {
        if(err) {
            console.log(err);
            return false;
        }
        let dbQuery = "SELECT menu_category.name AS category, COALESCE(items_in_orders.count, 0) AS value " +
            "FROM (SELECT menu.name as name, menu.id as id FROM menu " +
            "WHERE menu.category=$2) as menu_category " +
            "LEFT OUTER JOIN (SELECT item_in_order.item_id as item_id, count(*) AS count " +
            "FROM item_in_order, order_submitted " +
            "WHERE item_in_order.order_id = order_submitted.id AND EXTRACT(YEAR FROM order_submitted.date) = $1 " +
            "GROUP BY item_in_order.item_id) AS items_in_orders ON menu_category.id = items_in_orders.item_id";

        client.query(dbQuery,[year, category], function (err, result) {
            done();
            if(err) {
                console.log(err);
                return false;
            }

            resp.send({
                status: "success",
                data: result.rows
            });
        });
    });
});


router.post("/getItemStatForMonth", function (req, resp) {
    let year = req.body.year;
    let category = req.body.category;
    let month = req.body.month;

    if(year === undefined || category === undefined || month === undefined) {
        resp.send({
            status: "fail"
        });

        return;
    }

    pg.connect(dbURL, function (err, client, done) {
        if(err) {
            console.log(err);
            return false;
        }
        let dbQuery = "SELECT menu_category.name AS category, COALESCE(items_in_orders.count, 0) AS value " +
            "FROM (SELECT menu.name as name, menu.id as id FROM menu " +
            "WHERE menu.category=$3) as menu_category " +
            "LEFT OUTER JOIN (SELECT item_in_order.item_id as item_id, count(*) AS count " +
            "FROM item_in_order, order_submitted " +
            "WHERE item_in_order.order_id = order_submitted.id AND EXTRACT(YEAR FROM order_submitted.date) = $1 AND EXTRACT (MONTH FROM order_submitted.date) = $2 " +
            "GROUP BY item_in_order.item_id) AS items_in_orders ON menu_category.id = items_in_orders.item_id";

        client.query(dbQuery,[year, month, category], function (err, result) {
            done();
            if(err) {
                console.log(err);
                return false;
            }

            resp.send({
                status: "success",
                data: result.rows
            });
        });
    });
});

router.post("/updateName", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET name = $1 WHERE id = $2";
            client.query(dbQuery, [req.body.newName, parseInt(req.body.serialID)], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

router.post("/updateDescription", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET description = $1 WHERE id = $2 AND name = $3";
            client.query(dbQuery, [req.body.newDescription, req.body.serialID, req.body.oldName], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

router.post("/updatePrice", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET price = $1 WHERE id = $2 AND name = $3";
            client.query(dbQuery, [req.body.newPrice, req.body.serialID, req.body.oldName], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

router.post("/updateCategory", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET category = $1 WHERE id = $2 AND name = $3";
            client.query(dbQuery, [req.body.newCategory, req.body.serialID, req.body.oldName], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

router.post("/updateCookTime", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET cook_time = $1 WHERE id = $2 AND name = $3";
            client.query(dbQuery, [req.body.newCookTime, req.body.serialID, req.body.oldName], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

router.post("/updateStation", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET kitchen_station_id = $1 WHERE id = $2 AND name = $3";
            client.query(dbQuery, [req.body.newStation, req.body.serialID, req.body.oldName], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

router.post("/updateAll", function(req, resp) {

    var testedItem = menuTester.testItem(req.body);
    if (testedItem.passing) {
        pg.connect(dbURL, function(err, client, done) {
            if (err) {console.log(err)}

            let dbQuery = "UPDATE menu SET name = $1, price = $2, category = $3, description = $4, cook_time = $5, kitchen_station_id = $6  WHERE id = $7 AND name = $8";
            client.query(dbQuery, [req.body.newName, req.body.newPrice, req.body.newCategory, req.body.newDescription, req.body.newCookTime, req.body.newStaion, req.body.serialID, req.body.oldName], function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                rootFile.getMenuItems;
                resp.send({status: "success", msg: "item updated!"});

            });
        });
    } else {
        var message = testedItem.err.replace("\n\n", "<br>");
        resp.send({status: "success", msg: message});
    }
});

module.exports = router;