const express = require('express');
const app = express();
const fs = require("fs");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.json({
    extended: false
})

app.use("/html", express.static("../public_html/html"));
app.use("/css", express.static("../public_html/css"));
app.use("/js", express.static("../public_html/js"));
app.use("/img", express.static("../public_html/img"));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/index.html', "utf8");
    res.send(doc);
});

app.post('/api/createAccount', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;

    const mysql = require("mysql2")
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "SwapOmen"
    });
    connection.connect();

    let checkIfExists = `SELECT * FROM user WHERE username = '${username}'`;
    connection.query(checkIfExists, (err, result, fields) => {
        if (result[0]) {
            res.send({ status: "error", msg: "username taken" });
            return;
        }

        hashPassword(password, (hash, salt) => {
            try {
                let userRecords = "INSERT INTO user (username, email, passwordHash, passwordSalt) values ?";
                let recordValues = [
                    [username, email, hash, salt]
                ];
                connection.query(userRecords, [recordValues]);
                res.send({ status: "success", msg: "Account Created." });
                return;
            } catch (e) {
                res.send({ status: "error", msg: e });
                return;
            }
        });
    });
});

app.post('/api/deleteAccount', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;

    const mysql = require("mysql2")
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "SwapOmen"
    });
    connection.connect();

    authenticate(email, password, (results) => {
        connection.query(`DELETE FROM user WHERE ID = '${results.ID}'`, (err, result) => {
            if (err) {
                res.send({ status: "error", msg: e });
                return;
            }
            res.send({ status: "success", msg: "Account Deleted." });
        });
    });
});

app.use(function (req, res, next) {
    res.status(404).send("404");
})

async function hashPassword(plaintextPassword, callback) {
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(plaintextPassword, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            callback(hash, salt);
        });
    });
}

async function authenticate(email, password, callback) {
    const mysql = require("mysql2")
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "SwapOmen"
    });
    connection.connect();
    let query = "SELECT * FROM user WHERE email = '" + email + "' or username = '" + email + "'";
    connection.query(query, async function (error, results, fields) {
        //console.log(results)
        const authenticated = await bcrypt.compare(password, results[0].passwordHash);
        if (authenticated) {
            callback(results[0])
        }
    });

}

async function initializeDB() {
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });

    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS SwapOmen;
        use SwapOmen;
        CREATE TABLE IF NOT EXISTS user (
        ID int NOT NULL AUTO_INCREMENT,
        username varchar(30) UNIQUE NOT NULL,
        email varchar(30) NOT NULL,
        passwordHash varchar(100) NOT NULL,
        passwordSalt varchar(100) NOT NULL,
        PRIMARY KEY (ID));`;
    await connection.query(createDBAndTables);
    console.log('Listening on port ' + port);
}

let port = 8000;
app.listen(port, initializeDB);