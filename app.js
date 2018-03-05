var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));


app.listen(8080, function () {
    console.log("Listening on port 8080");
});