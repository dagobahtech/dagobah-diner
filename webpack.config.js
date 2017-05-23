const webpack = require("webpack");
const path = require("path");

var jsFolder = path.resolve(__dirname, "client/js");
var buildFolder = path.resolve(__dirname, "client/buildjs");

var config = {
    entry: {
        "orderview":jsFolder + "/overview.js",
        "kitchen":jsFolder + "/kitchen.js",
        "order":jsFolder + "/order.js"
    },
    output:{
        filename:"[name]bundle.js",
        path:buildFolder
    },
    plugins:[
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery"
        })
    ]
};

module.exports = config;