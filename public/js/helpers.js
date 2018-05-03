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
    if (input === "") {return;}
    StarliteUI.log.unshift(input);
    StarliteUI.draw();
};

Helpers.isEntityInTile = function(x, y) {
    var xmatch = Game.map.entities.filter(function (e) {
        return e.x === x;
    });
    var ymatch = [];
    if (xmatch.length > 0) {
        ymatch = xmatch.filter(function (e) {
            return e.y === y;
        });
    }

    if (ymatch.length > 0) {
        return true;
    }
    if (Player.entity.x === x && Player.entity.y === y) {return true};
    return false;
};

Helpers.findEntityInTile = function(x, y) {
    var xmatch = Game.map.entities.filter(function (e) {
        return e.x === x;
    });
    var ymatch = [];
    if (xmatch.length > 0) {
        ymatch = xmatch.filter(function (e) {
            return e.y === y;
        });
    }

    if (ymatch.length > 0) {
        return ymatch[0];
    }
    if (Player.entity.x === x && Player.entity.y === y) {return Player.entity};
    return null;
};

Helpers.randomInt = function (n) {
    return Math.floor(Math.random() * n) + 1;
};

Helpers.removeFromArray = function (array, value) {
    var i = array.indexOf(value);
    if(i != -1) {
        array.splice(i, 1);
    }
};

Helpers.worldToViewCoords = function (x, y) {
    var miny = Player.entity.y - Game.rangeY;
    var minx = Player.entity.x - Game.rangeX;

    return [x-minx,y-miny];
};

Helpers.drawTextCenter = function (display, x, y, string, color, bgColor) {
    var startX = x - (string.length / 2);
    display.drawText(startX, y, "%c{"+ color + "}" + string);
};