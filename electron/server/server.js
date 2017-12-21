const path = require('path')
var express = require('express');
var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app)
var io = require('socket.io')(http);

module.exports = function(port, callback) {
    io.on('connection', function(socket){
        console.log('a user connected');
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const low = require('lowdb')
    const lodashId = require('lodash-id');
    const FileSync = require('lowdb/adapters/FileSync')

    const adapter = new FileSync('db.json')
    const db = low(adapter);
    db._.mixin(lodashId);

    db.defaults(
        {
            runConfigs: [],
            runs: [],
            currentRunId: "",
            settings:
                {
                    hotkeys: {inc: 'CommandOrControl+I', up: 'CommandOrControl+U', down: 'CommandOrControl+D'}
                }
        }
    ).write();

    var routes = require('./routes')
    routes(app, db, io);

    app.use("/send", (req, res) => {
        io.emit("chat message", {"message": "hello"});
        res.json("sent message");
    })

    app.use(express.static(path.join(__dirname, './public')));

    http.listen(port, callback);



}






