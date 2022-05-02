const express = require('express');
const app = express();
const fs = require("fs");

app.use("/html", express.static("../public_html/html"));
app.use("/css", express.static("../public_html/css"));
app.use("/js", express.static("../public_html/js"));
app.use("/img", express.static("../public_html/img"));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/index.html', "utf8");
    res.send(doc);
});

app.use(function (req, res, next) {
    res.status(404).send("404");
})

let port = 8000;
app.listen(port, function () {
    console.log('Listening on port ' + port);
})