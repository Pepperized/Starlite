var Helpers = {};

Helpers.keyToArray = function (key) {
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    return [x,y];
};

Helpers.arrayToKey = function (x, y) {
    var key = x + "," + y;
    return key;
};