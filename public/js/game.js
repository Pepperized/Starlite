var Game = {};
if (!ROT.isSupported()) {
    console.log("The rot.js library isn't supported by your browser.");
} else {
    // Good to go!


    Game.seed = 1234;
    ROT.RNG.setSeed(Game.seed);

    Game.display = new ROT.Display({forceSquareRatio: true,});
    Game.container = Game.display.getContainer();
    document.body.appendChild(Game.container);

    Game.map = {
        data: {},
        floor: {},
        walls: {},
        doors: {},
    };

    Game.gen = {};
    Game.gen.digger = new ROT.Map.Digger();

    Game.gen.generateMap = function () {
        var digger = Game.gen.digger;

        var digCallback = function (x, y, value) {
            /* do not store walls */

            var key = Helpers.arrayToKey(x, y);
            if (!value) {
                Game.map.floor[key] = new Tiles.floor();
            }
            Game.map.data[key] = value ? "" : new Tiles.floor();
        };
        digger.create(digCallback.bind(this));
    };

    Game.gen.wallsPass = function () {
        for (var key in Game.map.floor) {
            var parts = Helpers.keyToArray(key);
            var x = parts[0];
            var y = parts[1];
            for (var i = 0; i < ROT.DIRS["8"].length; i++) {
                var dir = ROT.DIRS["8"][i];
                console.log(dir);
                var wx = x + dir[0];
                var wy = y + dir[1];
                var wkey = Helpers.arrayToKey(wx, wy);

                if (Game.map.data[wkey].ascii != ".") {
                    Game.map.data[wkey] = new Tiles.wall();
                }
            }
        }
    };

    Game.gen.addDoor = function (x, y) {
          var key = Helpers.arrayToKey(x, y);
          Game.map.doors[key] = true;
          Game.map.data[key] = new Tiles.door();
    };

    Game.gen.doorsPass = function () {
        var rooms = Game.gen.digger.getRooms();
        for (var i = 0; i < rooms.length; i++){
            var room = rooms[i];

            room.getDoors(Game.gen.addDoor);
        }
    };

    Game.gen.drawWholeMap = function () {
        for (var key in Game.map.data) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            Game.display.draw(x, y, Game.map.data[key].ascii);
        }
    };

    Game.gen.generateMap();
    Game.gen.wallsPass();
    Game.gen.doorsPass();
    Game.gen.drawWholeMap();
}