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

Helpers.keyMap = {};
Helpers.keyMap[38] = 0;
Helpers.keyMap[33] = 1;
Helpers.keyMap[39] = 2;
Helpers.keyMap[34] = 3;
Helpers.keyMap[40] = 4;
Helpers.keyMap[35] = 5;
Helpers.keyMap[37] = 6;
Helpers.keyMap[36] = 7;

Helpers.displayLog = function (input) {
    document.getElementById("action").innerText = input;
};