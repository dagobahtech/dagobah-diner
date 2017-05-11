const express = require("express");
const router = express.Router();

//stub function for now
//to see if everything works
router.get("/", function (req, resp) {
    resp.send("Welcome to kitchen ktichen-api. all kitchen posts and get will be handled here");
});

module.exports = router;