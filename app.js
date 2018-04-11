var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var path = require('path');
var NodeCouchDb = require('node-couchdb');
var couch = new NodeCouchDb({
    auth: {
        user:'admin',
        password:'admin'
    }
});

var dbname = 'enemies';
var viewURL = "_design/all_enemies/_view/all";

var socket = require('socket.io');

var server = app.listen(8080, function () {
    console.log("Listening on port 8080");
});

var io = socket(server);

couch.listDatabases().then(function (dbs) {
    //console.log(dbs);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

io.on('connection', function (socket) {
    console.log("made socket connection");

    socket.on('enemyData', function () {
        var dataRows = [];
        console.log("dispensing data");
        couch.get(dbname, viewURL).then(function (value) {
            console.log(value.data.rows);
            socket.emit('enemyData', value.data.rows);
        },function (reason) { console.log(reason); });

    });
});
