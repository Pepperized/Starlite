var express = require('express');
var app = express();
var randomWords = require('random-words');
var scheduler = require('node-schedule');
var bodyParser = require('body-parser');
var path = require('path');
var NodeCouchDb = require('node-couchdb');
var couch = new NodeCouchDb({
    auth: {
        user:'admin',
        password:'admin'
    }
});
var rn = require('random-number');
var options = {
    min:  0,
    max:  999999999,
    integer: true
};



var dbname = 'enemies';
var viewURL = "_design/all_enemies/_view/all";

var socket = require('socket.io');

var server = app.listen(8080, function () {
    console.log("Listening on port 8080");
});

var io = socket(server);

var job = scheduler.scheduleJob({hour: 0}, function(){
    GenSeed();
});

function GenSeed() {
    var seedName = randomWords({exactly:1, wordsPerString:2, separator:'-'});
    console.log(seedName);
    var seed = rn(options);
    console.log(seed);
    var date = new Date();

    couch.insert("seeds", {
        date: JSON.stringify(date),
        seedName: seedName[0],
        seed: seed
    }).then(function (_ref) {
        var data = _ref.data,
            headers = _ref.headers,
            status = _ref.status;
        console.log(status);
    }, function (err) {
        console.log(err);
    });
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

io.on('connection', function (socket) {
    console.log("made socket connection");

    socket.on('seeds', function () {
        var dataRows = [];
        console.log("dispensing data");
        couch.get("seeds", "_design/all_seeds/_view/all").then(function (value) {
            socket.emit('seeds', value.data.rows);
        },function (reason) { console.log(reason); });

    });

    socket.on('enemyData', function () {
        var dataRows = [];
        console.log("dispensing data");
        couch.get(dbname, viewURL).then(function (value) {
            socket.emit('enemyData', value.data.rows);
        },function (reason) { console.log(reason); });

    });
});

GenSeed();
