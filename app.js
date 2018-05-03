var express = require('express');
var app = express();
var randomWords = require('random-words');

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


var seedName = randomWords({exactly:1, wordsPerString:2, separator:'-'});
console.log(seedName);
var seed = rn(options);
console.log(seed);
var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
console.log([day, month, year]);
var dbname = 'enemies';
var viewURL = "_design/all_enemies/_view/all";

var socket = require('socket.io');

var server = app.listen(8080, function () {
    console.log("Listening on port 8080");
});

var io = socket(server);

couch.insert("seeds", {
    date: {day: day, month: month, year: year},
    seedName: seedName[0],
    seed: seed
}).then(function (_ref) {
    // data is json response
    // headers is an object with all response headers
    // status is statusCode number

    var data = _ref.data,
        headers = _ref.headers,
        status = _ref.status;
    console.log(status);
}, function (err) {
    console.log(err);
    // either request error occured
    // ...or err.code=EDOCCONFLICT if document with the same id already exists
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
            socket.emit('enemyData', value.data.rows);
        },function (reason) { console.log(reason); });

    });
});
