const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    product = require("./routes/product"),
    user = require("./routes/user");
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json())
app.use("/product", product);
app.use("/user", user);
app.get('*', (req, res) =>
    res.send("hii"));
app.listen(process.env.PORT || 8080, process.env.IP, function () {
    console.log("Minor Started");
});