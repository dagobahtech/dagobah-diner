const express = require("express");
const router = express.Router();
const path = require("path");


var loginForm = path.resolve(__dirname, "../client/admin/login.html");

router.get("/", function (req, resp) {
    resp.sendFile(loginForm);
});

router.post("/", function (req, resp){

    const pg = req.app.get("dbSettings").pg;
    const dbURL = req.app.get("dbSettings").dbURL;

    console.log(req.body);

    pg.connect(dbURL, function (err, client, done) {
        if(err){console.log(err)}
        let dbQuery = "SELECT * FROM user_login WHERE username = $1 AND password = $2";
        client.query(dbQuery, [req.body.username, req.body.password], function(err, result){
            done();
            if(err){console.log(err)}

            console.log(result.rows[0]);
            if(result.rows[0] !== undefined) {
                req.session.user_id = result.rows[0].type_id;
                req.session.SPK_user = result.rows[0].id;
                resp.send({
                    status: "success",
                    message: "login successfully",
                    type: req.session.user_id,
                    user: req.session.id
                });
            } else {
                resp.send({status: "failed", message: "incorrect login"});
            }
        });
    });
});

module.exports = router;