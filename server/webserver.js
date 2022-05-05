const express = require('express');
const app = express();
const fs = require("fs");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const session = require("express-session");

var urlencodedParser = bodyParser.json({
    extended: false
})

app.use(session({
    secret: "174683815744815909",
    name: "SWSession",
    resave: false,
    saveUninitialized: false
}));

app.use("/html", express.static("./public_html/html"));
app.use("/css", express.static("./public_html/css"));
app.use("/js", express.static("./public_html/js"));
app.use("/img", express.static("./public_html/img"));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/index.html', "utf8");
    res.send(doc);
});

app.get('/login', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/login.html', "utf8");
    res.send(doc);
});

app.post('/api/createAccount', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;
    const accessLevel = req.body.accessLevel;

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
                let userRecords = "INSERT INTO user (username, email, passwordHash, passwordSalt, accessLevel) values ?";
                let recordValues = [
                    [username, email, hash, salt, accessLevel]
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

app.post('/api/editAccount', urlencodedParser, function(req, res) {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const newUsername = req.body.newUsername;
        const newPassword = req.body.newPassword;
        const newEmail = req.body.newEmail;
        const newAccessLevel = req.body.newAccessLevel;

        const mysql = require("mysql2")
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "SwapOmen"
        });
        connection.connect();

        let query = "UPDATE user SET username = ?, email = ?, accessLevel = ? WHERE ID = ?;"
        connection.query(query, [newUsername ?? req.session.username, newEmail ?? req.session.email, newAccessLevel ?? req.session.accessLevel, req.session.uid], (err, result) => {
            if (err) {
                console.log(err);
            }
            req.session.name = newUsername ?? req.session.username;
            req.session.email = newEmail ?? req.session.email;
            req.session.email = newAccessLevel ?? req.session.accessLevel;
            res.status(200).send({"result": "Account info has been updated."})
        });
    }
});

app.post('/api/login', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const password = req.body.password;
    const user = req.body.username ?? req.body.email;

    authenticate(user, password, (result) => {
        if (result.status == 200) {

            req.session.loggedIn = true;
            req.session.email = result.user.email;
            req.session.name = result.user.username;
            req.session.uid = result.user.ID;
            req.session.accessLevel = result.user.accessLevel;

            req.session.save(function (err) {
                console.log(err);
            });
            res.status(200).send({"result": "Successfully logged in."})
        }
        else {
            res.status(400).send({"result": "Failed to log in."})
        }
    })
});

app.get("/api/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send({"result": "Failed", "msg": "Could not log out."})
            } else {
                res.status(200).send({"result": "Succeeded", "msg": "Successfully logged out."})
            }
        });
    }
});

app.get('/api/getUserInfo', urlencodedParser, function(req, res) {
    if (req.session.loggedIn) {
        res.send({"loggedIn": true, "name": req.session.name, "email": req.session.email, "uid": req.session.uid, "accessLevel": req.session.accessLevel});
    }
    else {
        res.send({"loggedIn": false});
    }
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
            callback({"status": 200, "user": results[0]});
        } else {
            callback({"status": 200, "user": {}});
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
            accessLevel int NOT NULL,
            PRIMARY KEY (ID)
        );
        
        CREATE TABLE IF NOT EXISTS listing (
            ID int NOT NULL AUTO_INCREMENT,
            posterID int NOT NULL,
            title varchar(50) NOT NULL,
            description TEXT NOT NULL,
            posted DATETIME default CURRENT_TIMESTAMP NOT NULL,
            images TEXT,
            PRIMARY KEY (ID)
        );
        `;
    await connection.query(createDBAndTables);
    console.log('Listening on port ' + port);
}

let port = 8000;
app.listen(port, initializeDB);