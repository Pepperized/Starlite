Gen = {};
Gen.digger = new ROT.Map.Digger(100, 100);

Gen.generateMap = function () {
    var digger = Gen.digger;

    var digCallback = function (x, y, value) {
        /* do not store walls */

        var key = Helpers.arrayToKey(x, y);
        if (!value) {
            Game.map.floor[key] = new Tiles.floor();
        }
        Game.map.tiles[key] = value ? "" : new Tiles.floor();
    };
    digger.create(digCallback.bind(this));
};

Gen.wallsPass = function () {
    for (var key in Game.map.floor) {
        var parts = Helpers.keyToArray(key);
        var x = parts[0];
        var y = parts[1];
        for (var i = 0; i < ROT.DIRS["8"].length; i++) {
            var dir = ROT.DIRS["8"][i];
            var wx = x + dir[0];
            var wy = y + dir[1];
            var wkey = Helpers.arrayToKey(wx, wy);

            if (Game.map.tiles[wkey].ascii != ".") {
                Game.map.tiles[wkey] = new Tiles.wall();
            }
        }
    }
};

Gen.addDoor = function (x, y) {
    var key = Helpers.arrayToKey(x, y);
    Game.map.doors[key] = true;
    Game.map.tiles[key] = new Tiles.door();
};

Gen.doorsPass = function () {
    var rooms = Gen.digger.getRooms();
    for (var i = 0; i < rooms.length; i++){
        var room = rooms[i];

        room.getDoors(Gen.addDoor);
    }
};

Gen.entityWeights = {
    "nothing": 95,
    "item" : 1,
    "enemy" : 4
};

Gen.entityPass = function () {
    for (var key in Game.map.floor) {
        var parts = Helpers.keyToArray(key);
        var x = parts[0];
        var y = parts[1];
        var ent = ROT.RNG.getWeightedValue(Gen.entityWeights);
        if (ent == "nothing"){continue;}
        else if (ent == "enemy"){
            Game.map.entities[key] = Enemy.spawnRandom(x,y);
        }

    }
};