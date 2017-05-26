const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const MenuItemValidator = require("./menuItemValidator");
const pool = require('../index');
const multer = require("multer");
const LoginValidator = require("./loginValidator");

const adminFolder = path.resolve(__dirname, "../client/admin");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './MenuPics')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let extension = path.extname(file.originalname);

        if (extension !== '.jpg' &&
            extension !== '.png' &&
            extension !== '.gif' &&
            extension !== '.jpeg' &&
            extension !== '.tiff') {
            return cb(new Error('Invaild File Type. File was not uploaded'))
        }

        cb(null, true)
    },
    limits:{
        fileSize:1000000 //size of u file
    },}).single('food_image');

/* Menu Access code section */

function getMenuItems(dagobah) {
    pool.query("SELECT * FROM menu",[], function(err, results){
        dagobah.menuItems = results.rows;
        console.log("Menu array in the server updated!");
    });
}


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

let menuTester = new MenuItemValidator();

/****************** ITEM CRUD *************************/

router.post("/getItems", function (req, resp) {


    pool.query("SELECT * FROM menu",[], function (err, result) {
        if(err) {
            return false;
        }
        resp.send(result.rows);
    })

});

router.post("/createItem", function (req, resp) {

    upload(req, resp, function (err) {
        if (err) {
            return resp.send({
                status: "fail",
                msg: err.message
            });
            return false
        }

        console.log(req.body);
        let body = req.body;


        if(req.file === undefined) {
            resp.send({
                status: "fail",
                msg: "No File Uploaded"
            });
            return false;
        }

        body.image = req.file.originalname;
        let testedItem = menuTester.testItem(body);
        if (testedItem.passing) {

            let dbQuery = "INSERT INTO menu (name, category, description, price, image_name, kitchen_station_id) VALUES ($1, $2, $3, $4, $5, $6)";
            pool.query(dbQuery, [body.name, body.category, body.desc, body.price, body.image, body.station], function(err, result) {
                if (err) {
                    console.log(err);
                    resp.end("ERROR");
                }

                getMenuItems(req.app.get("dagobah"));
                resp.send({status: "success", msg: "item created!"});

            });
        } else {
            let message = testedItem.err.replace("\n\n", "<br>");
            resp.send({status: "fail", msg: message});
        }
    })

    // console.log(req.body);
    // let testedItem = menuTester.testItem(req.body);
    // if (testedItem.passing) {
    //
    //     let dbQuery = "INSERT INTO menu (name, category, description, price, image_name, kitchen_station_id) VALUES ($1, $2, $3, $4, $5, $6)";
    //     pool.query(dbQuery, [req.body.name, req.body.category, req.body.desc, req.body.price, req.body.image, req.body.station], function(err, result) {
    //         if (err) {
    //             console.log(err);
    //             resp.end("ERROR");
    //         }
    //
    //         getMenuItems(req.app.get("dagobah"));
    //         resp.send({status: "success", msg: "item created!"});
    //
    //     });
    // } else {
    //     let message = testedItem.err;
    //     resp.send({status: "fail", msg: message});
    // }
});

/**************** ACCOUNT CRUD ***********************/
var loginTester = new LoginValidator();
router.post("/createAdmin", function(req, resp) {
    let validLogin = loginTester.testItem(req.body);
    if (validLogin.passing){
        console.log(req.body);
        let dbQuery = "INSERT INTO user_login (username, password, type_id) VALUES ($1, $2, $3)";
        bcrypt.hash(req.body.password, 5, function(err, bpass){
            pool.query(dbQuery, [req.body.username, bpass, req.body.type], function(err, result) {
                if(err) {
                    console.log(err);
                    resp.end("error creating admin account");
                }
                else {
                    console.log(result);
                    resp.send(result);
                }
            });
        });
    } else {
        resp.send({status : "fail", message : validLogin.err});
    }
});

// router.post("/deleteUser", function(req, resp) {
//     console.log(req.session.user);
//     console.log(req.body);
//     let dbQuery = "SELECT * FROM user_login WHERE id = ($1)";
//     pool.query(dbQuery, [req.session.SPK_user], function(err, result) {
//         var del = req.session.SPK_user;
//         if(err) {
//             console.log(err);
//         }
//         else {
//             console.log(result);
//             if(result.rows[0].password === req.body.pass) {
//                 req.session.destroy();
//                 let dbQuery2 = "DELETE FROM user_login WHERE id = ($1)";
//                 pool.query(dbQuery2, [del], function(err, result) {
//                     if(err) {
//                         console.log(err);
//                     }
//                     else {
//                         resp.send("success");
//                     }
//                 });
//             }
//             else {
//                 resp.send("error");
//             }
//         }
//     });
// });


/*************** STATISTICS *************************/
router.post("/getSummary", function(req, resp) {

    var summary = {};

    pool.connect(function(err, client, done) {
        if(err){console.error(err)}

        let dbQuery = "SELECT to_char(date AT TIME ZONE 'PST', 'YYYY-MM-DD') as date, COUNT(id) AS orders FROM order_submitted GROUP BY to_char(date AT TIME ZONE 'PST', 'YYYY-MM-DD') ORDER BY date;";
        client.query(dbQuery, [], function (err, result) {
            if (err) {console.log(err)}

            summary.ordersDate = result.rows;

            let dbQuery2 = "SELECT COUNT(date) FROM item_discarded;";
            client.query(dbQuery2, [], function (err, result) {
                if (err) {console.error(err)}

                summary.itemsDiscarded = result.rows[0].count;

                let dbQuery3 = "SELECT COUNT(active) FROM menu WHERE active = 't'";
                client.query(dbQuery3, [], function (err, result) {
                    if (err) {console.error(err)}

                    summary.itemsActive = result.rows[0].count;

                    let dbQuery4 = "SELECT id, TO_CHAR(date AT TIME ZONE 'PST', 'dd/Mon/yyyy') AS date, TO_CHAR(date AT TIME ZONE 'PST', 'HH24:mm:ss') AS time, total FROM order_submitted ORDER BY id DESC LIMIT 10";
                    client.query(dbQuery4, [], function(err, result) {
                        done();
                        if(err){console.log(err)}

                        summary.recentTransactions = result.rows;

                        resp.send(summary);
                    });
                });
            });
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
        });
        return false;
    }
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
            return;
        }
        if(type === 'sales') {
            dbQuery = "SELECT EXTRACT (WEEK FROM date) as category, SUM(total) as value from order_submitted WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (WEEK FROM date)";
        } else {
            dbQuery = "SELECT EXTRACT (WEEK FROM item_discarded.date) as category, SUM(menu.price) as value FROM item_discarded, menu where item_discarded.item_id = menu.id AND EXTRACT (YEAR FROM item_discarded.date) = $1 GROUP BY EXTRACT (WEEK FROM item_discarded.date)"
        }
        params = [year];
    } else {
        return false;
    }
    //if can't make the query, don't continue
    if(dbQuery === undefined) {
        resp.send({status: "fail"});
        return false;
    }
    pool.query(dbQuery,params, function(err, result){
        if(err){console.log(err)}

        resp.send({
            status: "success",
            data: result.rows,
            category: category,
            type: type
        });
    });
});

router.post("/getOrderStat", function (req, resp) {

    let year = req.body.year;

    if(year === undefined) {
        resp.send({
            status: "fail"
        });
    }
    let dbQuery = "SELECT EXTRACT (MONTH FROM date) AS category, COUNT(*) AS value from order_submitted WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (MONTH FROM date)";
    pool.query(dbQuery, [year], function (err, result) {
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
});

router.post("/getDiscardStat", function (req, resp) {

    let year = req.body.year;

    if(year === undefined) {
        resp.send({status: "fail"});
        return false;
    }

    let dbQuery ="SELECT EXTRACT (WEEK FROM date) AS category, COUNT(*) AS value from item_discarded WHERE EXTRACT (YEAR FROM date) = $1 GROUP BY EXTRACT (WEEK FROM date)";
    pool.query(dbQuery, [year], function (err, result) {
        if(err) {
            console.log(err);
            resp.send({status: "fail"});
            return false;
        }

        resp.send({
            status: "success",
            data: result.rows
        });

    });
});

router.post("/salesAtDate", function (req, resp) {

    if(req.body.year === undefined || req.body.month === undefined || req.body.day === undefined) {
        resp.send ({
            status: "fail"
        });
        return false;
    }

    let dbQuery = "SELECT COALESCE(SUM(total), 0.00) AS sales FROM order_submitted " +
        "WHERE EXTRACT(YEAR FROM order_submitted.date)=$1 " +
        "AND EXTRACT(MONTH FROM order_submitted.date)=$2 " +
        "AND EXTRACT(DAY FROM order_submitted.date AT TIME ZONE 'PST')=$3";

    pool.query(dbQuery, [req.body.year, req.body.month, req.body.day], function (err, result) {
        if(err) {
            console.log(err);
            resp.send({
                status: "fail"
            })
            return false
        }

        resp.send({
            status: "success",
            data: result.rows[0].sales
        })
    })
});

router.post("/discardsAtDate", function (req, resp) {

    if(req.body.year === undefined || req.body.month === undefined || req.body.day === undefined) {
        resp.send ({
            status: "fail"
        });

        return false;
    }

    let dbQuery = "SELECT COALESCE(SUM(menu.price), 0.00) as discards " +
        "FROM item_discarded, menu WHERE item_discarded.item_id = menu.id AND " +
        "EXTRACT(YEAR FROM item_discarded.date)=$1 " +
        "AND EXTRACT(MONTH FROM item_discarded.date)=$2 " +
        "AND EXTRACT(DAY FROM item_discarded.date AT TIME ZONE 'PST')=$3";

    pool.query(dbQuery, [req.body.year, req.body.month, req.body.day], function (err, result) {
        if(err) {
            console.log(err);
            resp.send({
                status: "fail"
            })
            return false;
        }

        console.log(result.rows[0].discards)
        resp.send({
            status: "success",
            data: result.rows[0].discards
        })
    })
});

router.post("/getOrderAvgStat", function (req, resp) {

    let year = req.body.year;

    if(year === undefined) {
        resp.send({status: "fail"});
        return false;
    }


    let dbQuery ="SELECT EXTRACT (MONTH FROM date) AS category, ROUND(AVG(count),2) AS value from " +
        "(SELECT order_submitted.id AS id, count(*) AS count, order_submitted.date AS date " +
        "from order_submitted, item_in_order WHERE order_submitted.id = item_in_order.order_id " +
        "AND EXTRACT (YEAR FROM order_submitted.date) = $1 GROUP BY order_submitted.id) " +
        "AS order_table GROUP BY EXTRACT (MONTH FROM date);";

    pool.query(dbQuery, [year], function (err, result) {
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

router.post("/getItemStatAll", function (req, resp) {
    let year = req.body.year;
    let category = req.body.category;

    if(year === undefined || category === undefined) {
        resp.send({status: "fail"});
        return false;
    }

    let dbQuery = "SELECT menu_category.name AS category, COALESCE(items_in_orders.count, 0) AS value " +
        "FROM (SELECT menu.name as name, menu.id as id FROM menu " +
        "WHERE menu.category=$2) as menu_category " +
        "LEFT OUTER JOIN (SELECT item_in_order.item_id as item_id, count(*) AS count " +
        "FROM item_in_order, order_submitted " +
        "WHERE item_in_order.order_id = order_submitted.id AND EXTRACT(YEAR FROM order_submitted.date) = $1 " +
        "GROUP BY item_in_order.item_id) AS items_in_orders ON menu_category.id = items_in_orders.item_id";

    pool.query(dbQuery,[year, category], function (err, result) {
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


router.post("/getItemStatForMonth", function (req, resp) {
    let year = req.body.year;
    let category = req.body.category;
    let month = req.body.month;

    if(year === undefined || category === undefined || month === undefined) {
        resp.send({status: "fail"});
        return false;
    }

    let dbQuery = "SELECT menu_category.name AS category, COALESCE(items_in_orders.count, 0) AS value " +
        "FROM (SELECT menu.name as name, menu.id as id FROM menu " +
        "WHERE menu.category=$3) as menu_category " +
        "LEFT OUTER JOIN (SELECT item_in_order.item_id as item_id, count(*) AS count " +
        "FROM item_in_order, order_submitted " +
        "WHERE item_in_order.order_id = order_submitted.id AND EXTRACT(YEAR FROM order_submitted.date) = $1 AND EXTRACT (MONTH FROM order_submitted.date) = $2 " +
        "GROUP BY item_in_order.item_id) AS items_in_orders ON menu_category.id = items_in_orders.item_id";

    pool.query(dbQuery,[year, month, category], function (err, result) {
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

router.post("/getItemStatToday", function (req, resp) {

    let year = req.body.year;
    let month = req.body.month;
    let day = req.body.day;
    let category = req.body.category
    if(year === undefined || category === undefined || month === undefined || day === undefined) {
        resp.send({status: "fail"});
        return false;
    }

    let dbQuery = "SELECT menu_category.name AS category, COALESCE(items_in_orders.count, 0) AS value " +
        "FROM (SELECT menu.name as name, menu.id as id FROM menu " +
        "WHERE menu.category=$4) as menu_category " +
        "LEFT OUTER JOIN (SELECT item_in_order.item_id as item_id, count(*) AS count " +
        "FROM item_in_order, order_submitted " +
        "WHERE item_in_order.order_id = order_submitted.id AND EXTRACT(YEAR FROM order_submitted.date) = $1 " +
        "AND EXTRACT (MONTH FROM order_submitted.date) = $2 AND EXTRACT (DAY FROM order_submitted.date AT TIME ZONE 'PST') =$3" +
        "GROUP BY item_in_order.item_id) AS items_in_orders ON menu_category.id = items_in_orders.item_id";

    pool.query(dbQuery,[year, month, day, category], function (err, result) {
        if(err) {
            console.log(err);
            return false;
        }

        resp.send({
            status: "success",
            data: result.rows
        });
    });
})


router.post("/updateAll", function(req, resp) {

    upload(req, resp, function (err) {
        if (err) {
            return resp.send({
                status: "fail",
                msg: err.message
            });
            return false
        }

        console.log(req.body);
        let body = req.body;

        if(req.file === undefined) {
            body.image = "temp.jpg" //temp. just so the test passes
        } else {
            body.image = req.file.filename;
        }

        let testedItem = menuTester.testItem(body);
        if (testedItem.passing) {

            let dbQuery;
            let params;
            if(req.file === undefined) {
                dbQuery = "UPDATE menu SET name = $1, price = $2, category = $3, description = $4, kitchen_station_id = $5  WHERE id = $6 RETURNING *";
                params = [body.name, parseFloat(body.price), parseInt(body.category), body.desc, parseInt(body.station), parseInt(body.itemID)]
            } else {
                dbQuery = "UPDATE menu SET name = $1, price = $2, category = $3, description = $4, kitchen_station_id = $5, image_name = $6  WHERE id = $7 RETURNING *";
                params = [body.name, parseFloat(body.price), parseInt(body.category), body.desc, parseInt(body.station), body.image, parseInt(body.itemID)]
            }

            pool.query(dbQuery, params, function(err, result) {
                if (err) {
                    console.log(err);
                    resp.end({status:"fail"});
                    return false;
                }

                console.log(result.rows[0]);
                getMenuItems(req.app.get("dagobah"));
                resp.send({status: "success", msg: "Item updated!", data: result.rows[0]});
            });
        } else {
            let message = testedItem.err.replace("\n\n", "<br>");
            resp.send({status: "fail", msg: message});
        }
    })

});

// var updateObject = {};
//
// router.post("/sendUpdate", function(req, resp){
//
//     if(req.body.type === "request"){
//
//         resp.send({status:"sent", item:updateObject});
//     }else{
//         updateObject = req.body;
//         console.log(updateObject);
//         resp.send({status:"recieved"});
//     }
// });

router.post("/restStatChange", function(req, resp) {
    if(req.body.status == "true") {
        let kitchen = req.app.get("dagobah").kitchen;
        req.app.get("dagobah").isOpen = false;
        req.app.get("socketio").emit("store status", (req.app.get("dagobah").isOpen));
        req.app.get("socketio").to("kitchen").emit("orders", kitchen._orderQueue.orders, kitchen._readyQueue.orders, kitchen._foodTray.items);
        resp.send(false);
    }
    else if (req.body.status == "false") {
        req.app.get("dagobah").isOpen = true;
        req.app.get("socketio").emit("store status", (req.app.get("dagobah").isOpen));
        resp.send(true);
    }
    else {
        resp.send(null);
        console.log("sending: error");
    }
});

router.post("/itemStatus", function(req, resp) {

    if(req.body.id===undefined) {resp.send({status:"fail"}); return false;}

    var itemId = parseInt(req.body.id);

    pool.query("UPDATE menu set active = not active where id=$1 returning active",[req.body.id], function (err, result) {
        if(err) {return false;}

        //update the menu items
        updateMenuItems(req.app.get('dagobah').menuItems, itemId, ['active'], [result.rows[0].active]);
        resp.send(result.rows[0].active);
    })
});


//update fields of menuItems field array with new values
function updateMenuItems(menuItems, id, fields, newValues) {
    console.log("updating items");
    if(fields.length !== newValues.length) {
        return false;
    }
    console.log(menuItems.length);
    for(let x = 0 ; x < menuItems.length ; x++) {

        let item = menuItems[x];
        console.log(item.id, id);
        if(item.id === id) {
            console.log("item found");
            for(let index = 0 ; index < fields.length ; index++) {
                if(!item.hasOwnProperty(fields[index])) {
                    console.log('no property found on', item, "with ", fields[index]);
                    continue;
                }
                console.log("updating", item[fields[index]], newValues[index]);
                item[fields[index]] = newValues[index];
            }
        }
    }
}

module.exports = {router, getMenuItems, bcrypt};