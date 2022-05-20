const express = require('express');
const fs = require("fs");
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server:server });

let sqlStuff = fs.readFileSync('sqlData.json');
const SQL_DATA = JSON.parse(sqlStuff);

class Connection {
    constructor(u1, u2) {
        this.u1 = u1;
        this.u2 = u2;
    }
}

let WSIDs = {

}

let ConnectedUsers = {

}

function generateWSID(msg) {
    for (let key in Object.keys(WSIDs)) {
        if ((WSIDs[key].u1id == msg.u1 && WSIDs[key].u2id == msg.u2) || (WSIDs[key].u2id == msg.u1 && WSIDs[key].u1id == msg.u2)) {
            reply({'id': msg.id, 'data': key});
            return;
        }
    }
    let wsid = Object.keys(WSIDs).length;
    reply({'id': msg.id, 'data': wsid});
    WSIDs[wsid] = {'u1id': msg.u1, 'u2id': msg.u2};
}

process.on('message', (msg) => {
    switch (msg.type) {
        case 'wsid':
            generateWSID(msg);
            break;
        default:
            console.log(msg);
            break;
    }
});

app.get('/', (req, res) => res.send("Websocket Server"));

wss.on('connection', function connection(ws, req) {
    //console.log(req.url);
    const cUrl = new URL('localhost:8001' + req.url).searchParams;
    console.log('New client connected.');
    ws.send(JSON.stringify({
        sender: 'server',
        msg: 'Successfully connected.'
    }));
    
    let uid = cUrl.get('uid');
    console.log(uid);

    ConnectedUsers[uid] = ws;

    ws.on('message', function message(data) {
        let parsedData = JSON.parse(data);

        const mysql = require("mysql2");
        const connection = mysql.createConnection(SQL_DATA);
        
        let query = "INSERT INTO message (senderID, recieverID, msg) VALUES ?";
        let values = [
            [parsedData.sender, parsedData.target, parsedData.msg]
        ];

        if (ConnectedUsers[parsedData.target] && ConnectedUsers[parsedData.target].readyState) {
            let toSend = JSON.stringify({
                sender: parsedData.sender,
                msg: parsedData.msg
            });
            ConnectedUsers[parsedData.target].send(toSend);
        }

        try {
            connection.query(query, [values]);
        } catch (e) {
            console.log(e);
        }
        
    });

    ws.on('error', (e) => {
        console.log(e);
    })
});

function reply(msg) {
    process.send(msg);
}

let port = 8001;
server.listen(port, console.log("Websocket listening on port " + port));