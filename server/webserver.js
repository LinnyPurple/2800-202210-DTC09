const express = require('express');
const app = express();
const fs = require("fs");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const session = require("express-session");
const res = require('express/lib/response');
const childProcess = require('child_process');
const net = require('net');
const {
    resolve
} = require('path');
// const { connection } = require('mongoose');
const jsdom = require("jsdom");

const path = require("path");
const multer = require('multer')

const websocketServer = childProcess.fork('websocketServer.js');

var urlencodedParser = bodyParser.json({
    extended: false
})

let sqlStuff = fs.readFileSync('sqlData.json');
const SQL_DATA = JSON.parse(sqlStuff);

app.use(session({
    secret: "174683815744815909",
    name: "SWSession",
    resave: false,
    saveUninitialized: false
}));

function reqLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
        // res.send({
        //     "Result": "Failed",
        //     "msg": "Not logged in."
        // });
        return;
    }
}

try {
    fs.readdirSync('../public_html/img');
} catch (err) {
    fs.mkdirSync('../public_html/img');
}

app.use("/html", express.static("../public_html/html"));
app.use("/css", express.static("../public_html/css"));
app.use("/js", express.static("../public_html/js"));
app.use("/img", express.static("../public_html/img"));
app.use(express.static('../public_html'));

//#region PUBLIC PAGES

app.get('/', function (req, res) {
    let doc;
    if (!req.session.loggedIn) {
        doc = fs.readFileSync('../public_html/html/index.html', "utf8");
    } else {
        doc = fs.readFileSync('../public_html/html/main.html', "utf8");
    }
    res.send(doc);
});

app.get('/login', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/login.html', "utf8");
    res.send(doc);
});

app.get('/signup', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/signup.html', "utf8");
    res.send(doc);
});

app.get('/account', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/account.html', "utf8");
    res.send(doc);
});

app.get('/admin', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/admin.html', "utf8");
    res.send(doc);
});

app.get('/websocket', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/websocket.html', "utf8");
    res.send(doc);
});

app.get('/review', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/review.html', "utf8");
    res.send(doc);
});

app.get('/profile', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/profile.html', "utf8");
    res.send(doc);
});

app.get('/posting', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/posting.html', "utf8");
    res.send(doc);
});

app.get('/editpost', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/editPost.html', "utf8");
    res.send(doc);
});

app.get('/tradeOffers', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/tradeOffer.html', "utf8");
    res.send(doc);
});

app.get('/sentTradeOffers', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/sentOffers.html', "utf8");
    res.send(doc);
});

app.get('/confirmation', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/confirmation.html', "utf8");
    res.send(doc);
});

app.get('/listings', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/listings.html', "utf8");
    res.send(doc);
});

app.get('/main', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/main.html', "utf8");
    res.send(doc);
});

app.get('/sendTradeOffer', reqLogin, async (req, res) => {
    let doc = fs.readFileSync('../public_html/html/sendTradeOffer.html', "utf8");
    res.send(doc);
});

app.get('/chat/:uid', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/chat.html', "utf8");
    res.send(doc);
});

app.get('/chat/', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/viewChats.html', "utf8");
    res.send(doc);
});

app.get('/item', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/item.html', "utf8");
    res.send(doc);
});

app.get('/traderinfo', reqLogin, function (req, res) {
    let doc = fs.readFileSync('../public_html/html/traderInfo.html', "utf8");
    res.send(doc);
});

app.get('/error', function (req, res) {
    let doc = fs.readFileSync('../public_html/html/error.html', "utf8");
    res.send(doc);
});

//#endregion

//#region API

//#region USER INFO

app.post('/api/createAccount', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;
    const accessLevel = 1;

    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let checkIfExists = `SELECT * FROM user WHERE username = '${username}'`;
    connection.query(checkIfExists, (err, result, fields) => {
        if (result[0]) {
            res.send({
                status: "error",
                msg: "username taken"
            });
            return;
        }

        hashPassword(password, (hash, salt) => {
            try {
                let userRecords = "INSERT INTO user (username, email, passwordHash, passwordSalt, accessLevel) values ?";
                let recordValues = [
                    [username, email, hash, salt, accessLevel]
                ];
                connection.query(userRecords, [recordValues]);
                res.send({
                    status: "success",
                    msg: "Account Created."
                });
                return;
            } catch (e) {
                res.send({
                    status: "error",
                    msg: e
                });
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
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    authenticate(email, password, (results) => {
        connection.query(`DELETE FROM user WHERE ID = '${results.user.ID}'`, (err, result) => {
            if (err) {
                res.send({
                    status: "error",
                    msg: err
                });
                return;
            }
            res.send({
                status: "success",
                msg: "Account Deleted."
            });
        });
    });
});

app.post('/api/editAccount', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const newUsername = req.body.newUsername;
        const newPassword = req.body.newPassword;
        const newEmail = req.body.newEmail;
        const newAccessLevel = req.session.accessLevel;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "UPDATE user SET username = ?, email = ?, accessLevel = ? WHERE ID = ?;"
        connection.query(query, [newUsername ? newUsername : req.session.username, newEmail ? newEmail : req.session.email, newAccessLevel ? newAccessLevel : req.session.accessLevel, req.session.uid], (err, result) => {
            if (err) {
                console.log(err);
            }
            req.session.name = newUsername ? newUsername : req.session.username;
            req.session.email = newEmail ? newEmail : req.session.email;
            req.session.email = newAccessLevel ? newAccessLevel : req.session.accessLevel;
            res.status(200).send({
                "result": "Account info has been updated."
            })
        });
    }
});

app.post('/api/resetPassword', urlencodedParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const newPassword = req.body.newPassword;
    const userID = req.session.uid;

    hashPassword(newPassword, (hash, salt) => {
        let userRecords = "UPDATE user SET passwordHash = ?, passwordSalt = ? WHERE ID = ?;";
        let recordValues = [hash, salt, userID];

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        connection.query(userRecords, recordValues, (err, result) => {
            res.send({
                status: "success",
                msg: "Password Updated."
            });
        });
    });
});

//upload profile photo
try {
    fs.readdirSync('../public_html/img/profiles'); // check folder
} catch (err) {
    fs.mkdirSync('../public_html/img/profiles'); // Create folder
}

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../public_html/img/profiles/') // directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 500000
    }
}).single('image');


//route for upload data
app.post("/upload", (req, res) => {
    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.write("<script>alert('Maximum file size is 500KB.')</script>");
            res.write("<script>window.location.href = '/profile'</script>");
            // res.status(400).json({error: "Allowed file size is 500KB."});
        } else {
            if (req.file) {
                console.log(req.file.filename)
                var imgsrc = '/img/profiles/' + req.file.filename
                let query = `UPDATE user SET image = ? WHERE ID = ${req.session.uid};`

                connection.query(query,
                    [imgsrc ? imgsrc : req.session.image], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        req.session.image = imgsrc ? imgsrc : req.session.image;

                        res.redirect("profile")
                    });
            }
        }
    });
});


app.post('/api/editAccount2', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const newUsername = req.body.newUsername;
        // const newPassword = req.body.newPassword;
        // const newAccessLevel = req.body.newAccessLevel;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = `UPDATE user SET username = ? WHERE ID = ${req.session.uid};`

        connection.query(query,
            [newUsername ? newUsername : req.session.username, ], (err, result) => {
                if (err) {
                    console.log(err);
                }
                req.session.name = newUsername ? newUsername : req.session.username;

                res.status(200).send({
                    "result": "Account info has been updated."
                })
            });
    }
});


app.post('/api/admin/promoteAccount', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");

    if (req.session.accessLevel >= 3) {
        const toPromote = req.body.toPromote;
        const newAccessLevel = req.body.newAccessLevel;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();
        let query = "UPDATE user SET accessLevel = ? WHERE ID = ?;"
        let values = [newAccessLevel, toPromote];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.log(err);
            }
            res.status(200).send({
                "Result": "Success",
                "msg": "Account has been promoted."
            });
        });
    } else {
        res.status(400).send({
            "Result": "Failed",
            "msg": "User doesn't have the required access level."
        })
    }
});

app.get('/api/admin/getUserList', (req, res) => {
    if (req.session.accessLevel >= 3) {
        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "SELECT ID, username, email, accessLevel FROM user";
        connection.query(query, (err, result) => {
            res.status(200).send({
                "result": "Account has been promoted.",
                "data": result
            });
        });
    } else {
        res.status(400).send({
            "Result": "Failed",
            "data": "User doesn't have the required access level."
        })
    }
});



app.post('/api/login', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const password = req.body.password;
    const user = req.body.username ? req.body.username : req.body.email;

    authenticate(user, password, (result) => {
        if (result.status == 200) {

            req.session.loggedIn = true;
            req.session.email = result.user.email;
            req.session.name = result.user.username;
            req.session.uid = result.user.ID;
            req.session.accessLevel = result.user.accessLevel;
            req.session.image = result.user.image;

            req.session.save(function (err) {
                //console.log(err);
            });
            res.status(200).send({
                "result": "Successfully logged in."
            })
        } else {
            res.status(400).send({
                "result": "Failed to log in."
            })
        }
    })
});

app.get("/api/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send({
                    "result": "Failed",
                    "msg": "Could not log out."
                })
            } else {
                res.status(200).send({
                    "result": "Succeeded",
                    "msg": "Successfully logged out."
                })
            }
        });
    }
});

app.get('/api/getUserInfo', urlencodedParser, function (req, res) {
    if ((req.query.uid == undefined && req.query.username == undefined) || (req.query.uid == null && req.query.username == null)) {
        if (req.session.loggedIn) {
            //console.log(req.session)
            res.send({
                "loggedIn": true,
                "name": req.session.name,
                "email": req.session.email,
                "uid": req.session.uid,
                "accessLevel": req.session.accessLevel,
                "image": req.session.image
            });
        } else {
            res.send({
                "loggedIn": false
            });
        }
    } else {
        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let checkIfExists = `SELECT * FROM user WHERE username = '${req.query.username}' OR ID = ${parseInt(req.query.uid ? req.query.uid : -1)}`;
        connection.query(checkIfExists, (err, result) => {
            if (result != null && result.length > 0) {
                res.status(200).send({
                    'result': 'Success',
                    'msg': 'Sucessfully found user.',
                    'uid': result[0].ID,
                    'username': result[0].username,
                    'image': result[0].image
                });
            } else {
                res.status(400).send({
                    'result': 'Failed',
                    'msg': 'User not found.'
                })
            }
        });
    }
});

//#endregion

//#region LISTINGS

//upload posting image
try {
    fs.readdirSync('../public_html/img/post'); // Check folder
} catch (err) {
    fs.mkdirSync('../public_html/img/post'); // Create folder
}

var storagePost = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../public_html/img/post/') // directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var uploadPost = multer({
    storage: storagePost,
    limits: {
        fileSize: 500000
    }
}).single('image');


// Upload posting
app.post("/uploadposting", (req, res) => {
    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    uploadPost(req, res, function (err) {
        // send error message when file size is over 500KB
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.write("<script>alert('Maximum file size is 500KB.')</script>");
            res.write("<script>history.go(-1)</script>");
            // res.status(400).json({error: "Allowed file size is 500KB."});
        } else {
            // store all user input
            const title = req.body.title;
            const myItem = req.body.myItem;
            const tradingItem = req.body.tradingItem;
            const condition = req.body.condition;
            const tradingMethod = req.body.tradingMethod;
            const description = req.body.description;
            let images = null;
            if (req.file) {
                images = req.file.filename;
            }

            var re = /(.*)\.(.*)/;
            var image_type = re.exec(images);
            if (!image_type) image_type = "null";
            else image_type = image_type[2];

            // Check all mandatory input is filled in
            if (title == '' || myItem == 'My Item' || tradingItem == 'Looking For' || condition == 'Select Condition' || tradingMethod == 'Select Method') {
                res.write("<script>alert('Please fill out all the required fields (with red asterisk).')</script>");
                res.write("<script>history.go(-1)</script>");
            } else if (image_type !== "png" && image_type !== "jpg" && image_type !== "jpeg") {
                res.write("<script>alert('Invalid file given. Please give an image.')</script>");
                res.write("<script>history.go(-1)</script>");
            } else {
                let query = "INSERT INTO listing (posterID, title, myItemCategory, tradingItemCategory, itemCondition, tradingMethod, description, images) values ?";
                let values = [
                    [req.session.uid, title, myItem, tradingItem, condition, tradingMethod, description, images]
                ]

                connection.query(query, [values], (err, result) => {
                    if (result) {
                        console.log(result.insertId)
                        res.redirect('/item?post_id=' + result.insertId);
                    } else {
                        console.log(err)
                    }
                })
            }

        }
    })

});

// Edit posting
app.post("/editposting", (req, res) => {
    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();


    uploadPost(req, res, function (err) {
        // send error message when file size is over 500KB
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.write("<script>alert('Maximum file size is 500KB.')</script>");
            res.write("<script>history.go(-1)</script>");
            // res.status(400).json({error: "Allowed file size is 500KB."});
        } else {
            // store all user input
            const postID = req.body.postID;
            const title = req.body.title;
            const myItem = req.body.myItem;
            const tradingItem = req.body.tradingItem;
            const condition = req.body.condition;
            const tradingMethod = req.body.tradingMethod;
            const description = req.body.description;

            var re = /(.*)\.(.*)/;
            var image_type = re.exec(req.file.filename);
            if (!image_type) image_type = "null";
            else image_type = image_type[2];

            // Check all mandatory input is filled in
            if (title == '' || myItem == 'My Item' || tradingItem == 'Looking For' || condition == 'Select Condition' || tradingMethod == 'Select Method') {
                res.write("<script>alert('Please fill out all the reqired fields (with red asterisk).')</script>");
                res.write("<script>history.go(-1)</script>");
            } else if (image_type !== "png" && image_type !== "jpg" && image_type !== "jpeg") {
                res.write("<script>alert('Invalid file given. Please give an image.')</script>");
                res.write("<script>history.go(-1)</script>");
            } else {
                // Update database
                if (req.file) {
                    const images = req.file.filename;
                    let query = "UPDATE listing SET title = ?, myItemCategory = ?, tradingItemCategory = ?, itemCondition = ?, tradingMethod =? , description = ?, images = ? WHERE ID = ?";

                    connection.query(query, [title, myItem, tradingItem, condition, tradingMethod, description, images, postID], (err, result) => {
                        if (result) {
                            res.redirect('/item?post_id=' + postID);
                        } else {
                            console.log(err)
                        }
                    })
                } else {
                    // Update except image
                    let query = "UPDATE listing SET title = ?, myItemCategory = ?, tradingItemCategory = ?, itemCondition = ?, tradingMethod =? , description =? WHERE ID = ?";

                    connection.query(query, [title, myItem, tradingItem, condition, tradingMethod, description, postID], (err, result) => {
                        if (result) {
                            res.redirect('/item?post_id=' + postID);
                        } else {
                            console.log(err)
                        }
                    })
                }
            }

        }
    })

});

app.post('/api/postListing', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");

    if (req.session.loggedIn) {
        const title = req.body.title;
        const myItem = req.body.myItem;
        const tradingItem = req.body.tradingItem;
        const condition = req.body.condition;
        const tradingMethod = req.body.tradingMethod;
        const description = req.body.description;
        const images = req.body.images;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "INSERT INTO listing (posterID, title, myItemCategory, tradingItemCategory, itemCondition, tradingMethod, description) values ?";
        let values = [
            [req.session.uid, title, myItem, tradingItem, condition, tradingMethod, description]
        ]

        connection.query(query, [values], (result, err) => {
            console.log(err);
            res.status(200).send({
                "Result": "Success",
                "msg": "Successfully posted listing.",
                "id": err.insertId
            });
        })

    } else {
        res.status(400).send({
            "Result": "Failed",
            "msg": "Not logged in",
            "id": null
        })
    }
});

app.post('/api/archiveListing', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");

    if (req.session.loggedIn) {
        const id = req.body.postID;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        connection.query(`SELECT posterID FROM listing WHERE ID = ${id}`, (errAuth, resAuth) => {
            if (resAuth[0] == null) {
                res.status(400).send({
                    "Result": "Failed",
                    "msg": "Listing not found."
                });
                return;
            }
            if (resAuth[0].posterID == req.session.uid) {
                let query = "UPDATE listing SET archived = ? WHERE ID = ?";
                let values = [1, id];

                connection.query(query, values, (result, err) => {
                    res.status(200).send({
                        "Result": "Success",
                        "msg": "Successfully archived listing."
                    });
                })
            }
        });
    } else {
        res.status(400).send({
            "Result": "Failed",
            "msg": "Not logged in"
        })
    }
});

app.get('/api/searchListings', (req, res) => {
    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let s = req.query.s;
    const regex = new RegExp(`.*${s}.*`, 'i');

    let matches = [];

    let query = "SELECT * FROM listing WHERE archived = 0";
    connection.query(query, (err, result) => {
        for (let row in result) {
            let listing = result[row];
            if (listing["title"].match(regex) || listing["description"].match(regex)) {
                matches.push(listing);
            }
        }

        res.send(matches);
    });
});

app.get('/api/getListingsFromUser/:uid', (req, res) => {
    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();
    let uid = req.params.uid;

    let query = "SELECT * FROM listing WHERE posterID = ?";
    connection.query(query, uid, (err, result) => {
        res.send(result);
    });
});

app.get('/api/getListingsFromUserNotDone/:uid', (req, res) => {
    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();
    let uid = req.params.uid;

    let query = "SELECT * FROM listing WHERE posterID = ? AND archived = 0";
    connection.query(query, uid, (err, result) => {
        res.send(result);
    });
});

app.get("/api/getListingData", async function (req, res) {
    let auctionID = req.query.id;
    let result = await getListingData(auctionID);

    res.status(result.Result == "Success" ? 200 : 400).send(result.Data);
});

function getListingData(auctionID) {
    return new Promise(resolve => {
        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "SELECT * FROM listing WHERE ID = ?";
        connection.query(query, auctionID, (err, result) => {
            if (result != null) {
                resolve({
                    "Result": "Success",
                    "Data": result[0]
                });
            } else {
                resolve({
                    "Result": "Failed",
                    "Data": null
                });
            }
        });
    })
}

app.get('/api/getTraderInfo', urlencodedParser, (req, res) => {
    let traderID = req.query.id;

    const mysql = require("mysql2");
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let query = 'SELECT * FROM user WHERE ID = ?';
    let values = [traderID];

    connection.query(query, values, (err, result) => {
        if (result[0] != null) {
            res.send({
                "result": "Success",
                "data": result[0]
            })
        } else {
            res.status(400).send({
                "result": "Failed",
                "data": null
            });
        }
    });
});

//#endregion

//#region REVIEWS

app.post('/api/postReview', urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const reviewer = req.session.uid;
        const reviewee = req.body.reviewee;
        const reviewText = req.body.reviewText;
        const score = req.body.score;
        const postID = req.body.postID;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        console.log(reviewText, reviewee, reviewer, score, postID)
        let query = "INSERT INTO review (reviewerID, revieweeID, reviewText, score, postID) values ?"
        let recordValues = [
            [reviewer, reviewee, reviewText, score, postID]
        ];

        connection.query(query, [recordValues]);
        res.send({
            "result": "Success",
            "msg": "Review saved."
        });
    } else {
        res.send({
            "result": "Failed",
            "msg": "Not logged in."
        })
    }
});

app.post('/api/deleteReview', urlencodedParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const reviewer = req.session.uid;
        const reviewee = req.body.reviewee;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = 'DELETE FROM review WHERE reviewerID = ? AND revieweeID = ?';
        let values = [reviewer, reviewee];

        connection.query(query, values, (err, result) => {
            res.send({
                "result": "Success",
                "msg": "Review deleted."
            })
        });
    } else {
        res.send({
            "result": "Failed",
            "msg": "Not logged in."
        })
    }
});

app.post('/api/editReview', urlencodedParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const reviewer = req.session.uid;
        const reviewee = req.body.reviewee;
        const reviewText = req.body.reviewText;
        const score = req.body.score;

        const mysql = require("mysql2");
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = 'UPDATE review SET reviewText = ?, score = ? WHERE reviewerID = ? AND revieweeID = ?';
        let values = [reviewText, score, reviewer, reviewee];

        connection.query(query, values, (err, result) => {
            res.send({
                "result": "Success",
                "msg": "Review updated."
            })
        });
    } else {
        res.status(400).send({
            "result": "Failed",
            "msg": "Not logged in."
        })
    }
});

app.get('/api/getReview', urlencodedParser, (req, res) => {
    const reviewer = req.query.reviewer;
    const reviewee = req.query.reviewee;

    const mysql = require("mysql2");
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let query = 'SELECT * FROM review WHERE reviewerID = ? AND revieweeID = ?';
    let values = [reviewer, reviewee];

    connection.query(query, values, (err, result) => {
        if (result[0] != null) {
            res.send({
                "result": "Success",
                "data": result[0]
            })
        } else {
            res.status(400).send({
                "result": "Failed",
                "data": null
            });
        }
    });
});

app.get('/api/getReviews', (req, res) => {
    const reviewee = req.query.reviewee;

    const mysql = require("mysql2");
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let query = 'SELECT * FROM review WHERE revieweeID = ?';
    let values = [reviewee];

    connection.query(query, values, (err, result) => {
        if (result[0] != null) {
            res.send({
                "result": "Success",
                "data": result
            })
        } else {
            res.status(400).send({
                "result": "Failed",
                "data": null
            });
        }
    });
});

//#endregion

//#region WEBSOCKET

let ids = {}

let responses = {}

websocketServer.on('message', (msg) => {
    responses[msg.id] = msg.data;
    ids[msg.id].callback(msg.data);
});

app.get('/getWSID', (req, res) => {
    let id = Object.keys(ids).length;
    websocketServer.send({
        'type': 'wsid',
        'id': id,
        'u1': req.query.requestor,
        'u2': req.query.target
    });
    ids[id] = {
        'callback': (wsid) => {
            res.status(200).send({
                'wsid': wsid
            });
        }
    };
});

app.get('/getMessageLogs/:target', reqLogin, (req, res) => {
    console.log(req.params.target);
    if (req.session.loggedIn) {
        const mysql = require("mysql2");
        const connection = mysql.createConnection(SQL_DATA);

        let query = `SELECT * FROM message WHERE ((senderID = ${req.session.uid} AND recieverID = ${parseInt(req.params.target)}) OR (senderID = ${parseInt(req.params.target)} AND recieverID = ${req.session.uid}))`;
        let values = [req.session.uid, parseInt(req.params.target), parseInt(req.params.target), req.session.uid]

        connection.query(query, values, (err, result) => {
            res.send(result);
        });
    } else {
        res.send({
            'result': 'Error, not logged in.'
        })
    }
});

app.get('/openChats', reqLogin, (req, res) => {
    let uid = req.session.uid;
    const mysql = require("mysql2");
    const connection = mysql.createConnection(SQL_DATA);

    let query = `SELECT senderID, recieverID FROM message WHERE senderID = ${uid} OR recieverID = ${uid}`;
    let values = [req.session.uid, req.session.uid]
    let set = new Set();

    connection.query(query, values, (err, result) => {
        for (msgI in result) {
            let msg = result[msgI];
            set.add(msg.senderID);
            set.add(msg.recieverID);
        }
        set.delete(uid);
        let tmp = JSON.stringify([...set]);
        res.send(tmp);
    });
});

//#endregion

//#region TRADE OFFERS

app.post('/api/sendTradeOffer', urlencodedParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const offererID = req.session.uid;
        const offereeID = req.body.offereeID;
        const offererListingID = req.body.offererListingID;
        const offereeListingID = req.body.offereeListingID;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "INSERT INTO offers (offererID, offereeID, offererListingID, offereeListingID) values ?"
        let recordValues = [
            [offererID, offereeID, offererListingID, offereeListingID]
        ];

        connection.query(query, [recordValues]);
        res.send({
            "result": "Success",
            "msg": "Offer Sent."
        });
    } else {
        res.send({
            "result": "Failed",
            "msg": "Not logged in."
        })
    }
});

app.post('/api/replyTradeOffer', urlencodedParser, reqLogin, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const accepted = req.body.accepted;
    const offerID = req.body.offerID;
    console.log(accepted);

    const mysql = require("mysql2")
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let query = "UPDATE offers SET status = ? WHERE ID = ?";
    let values = [accepted, offerID];
    connection.query(query, values, (err, result) => {
        res.send({
            "result": "success",
            "msg": `${accepted ? 'Accepted' : 'Declined'} trade offer.`
        });
    });
});

app.get('/api/getTradeOffersToMe', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const uid = req.session.uid;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "SELECT * FROM offers WHERE offereeID = ? AND status = -1"
        let recordValues = uid;

        connection.query(query, [recordValues], (err, result) => {
            res.send({
                "result": "Success",
                "msg": "Retrieved offers.",
                "data": result
            });
        });
    } else {
        res.send({
            "result": "Failed",
            "msg": "Not logged in.",
            "data": {}
        })
    }
});

app.get('/api/getTradeOffersFromMe', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.loggedIn) {
        const uid = req.session.uid;

        const mysql = require("mysql2")
        const connection = mysql.createConnection(SQL_DATA);
        connection.connect();

        let query = "SELECT * FROM offers WHERE offererID = ?"
        let recordValues = uid;

        connection.query(query, [recordValues], (err, result) => {
            res.send({
                "result": "Success",
                "msg": "Retrieved offers.",
                "data": result
            });
        });
    } else {
        res.send({
            "result": "Failed",
            "msg": "Not logged in.",
            "data": {}
        })
    }
});

app.post('/api/getOfferByid', urlencodedParser, (req, res) => {
    const offerID = req.body.offerID;

    const mysql = require("mysql2");
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();

    let query = 'SELECT * FROM offers WHERE ID = ?';
    let values = [offerID];

    connection.query(query, values, (err, result) => {
        if (result[0] != null) {
            res.send({
                "result": "Success",
                "data": result[0]
            })
        } else {
            res.status(400).send({
                "result": "Failed",
                "data": null
            });
        }
    });
});

//#endregion

//#endregion

app.use(function (req, res, next) {
    let doc = fs.readFileSync('../public_html/html/error.html', "utf8");
    res.status(404).send(doc);
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
    const connection = mysql.createConnection(SQL_DATA);
    connection.connect();
    let query = "SELECT * FROM user WHERE email = '" + email + "' OR username = '" + email + "'";
    connection.query(query, async function (error, results, fields) {
        if (!results[0]) {
            callback({
                "status": 400,
                "user": {}
            });
            return;
        }
        const authenticated = await bcrypt.compare(password, results[0].passwordHash);
        if (authenticated) {
            callback({
                "status": 200,
                "user": results[0]
            });
        } else {
            callback({
                "status": 400,
                "user": {}
            });
        }
    });

}

async function initializeDB() {
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: SQL_DATA.host,
        user: SQL_DATA.user,
        password: SQL_DATA.password,
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
            image TEXT,
            PRIMARY KEY (ID)
        );

        CREATE TABLE IF NOT EXISTS listing (
            ID int NOT NULL AUTO_INCREMENT,
            posterID int NOT NULL,
            title varchar(50) NOT NULL,
            myItemCategory TEXT NOT NULL,
            tradingItemCategory TEXT NOT NULL,
            itemCondition TEXT NOT NULL,
            tradingMethod TEXT NOT NULL,
            description TEXT NOT NULL,
            posted DATETIME default CURRENT_TIMESTAMP NOT NULL,
            images TEXT,
            archived int default 0,
            PRIMARY KEY (ID)
        );

        CREATE TABLE IF NOT EXISTS message (
            senderID int NOT NULL,
            recieverID int NOT NULL,
            msg TEXT NOT NULL,
            timestamp DATETIME default CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY (senderID, recieverID, timestamp)
        );

        CREATE TABLE IF NOT EXISTS review (
            postID int NOT NULL,
            reviewerID int NOT NULL,
            revieweeID int NOT NULL,
            reviewText TEXT NOT NULL,
            score int NOT NULL,
            timestamp DATETIME default CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY (postID)
        );

        CREATE TABLE IF NOT EXISTS offers (
            ID int NOT NULL AUTO_INCREMENT,
            offererID int NOT NULL,
            offereeID int NOT NULL,
            offererListingID int NOT NULL,
            offereeListingID int NOT NULL,
            status int default -1,
            timestamp DATETIME default CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY (ID)
        );
        `;
    await connection.query(createDBAndTables);
    console.log('Listening on port ' + port);
}

let port = 8000;
app.listen(port, initializeDB);
