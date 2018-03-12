var Game = {};
if (!ROT.isSupported()) {
    console.log("The rot.js library isn't supported by your browser.");
} else {
    // Good to go!

    Game.player = null;

    Game.initializePlayer = function () {
        Player.createPlayerRandomly();
    };

    Game.seed = 12345;
    ROT.RNG.setSeed(Game.seed);

    Game.display = new ROT.Display({width: 90, height: 40, forceSquareRatio: true});
    Game.rangeX = Game.display.getOptions().width / 2;
    Game.rangeY = Game.display.getOptions().height / 2;
    Game.container = Game.display.getContainer();
    document.body.appendChild(Game.container);

    Game.map = {
        tiles: {},
        entities: [],
        floor: {},
        walls: {},
        doors: {},
    };

    Game.engine = null;

    Game.scheduler = new ROT.Scheduler.Simple();

    Game.drawWholeMap = function () {
        for (var key in Game.map.tiles) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            Game.display.draw(x, y, Game.map.tiles[key].ascii);
        }

        for (var j = 0; j < Game.map.entities.length; j++) {
            var entity = Game.map.entities[j];
            Game.display.draw(entity.x, entity.y, entity.ascii);
        }
    };

    Game.drawAroundPlayer = function (rangex, rangey) {
        Game.display.clear();
        var minx = Player.entity.x - rangex;
        var maxx = Player.entity.x + rangex;
        var miny = Player.entity.y - rangey;
        var maxy = Player.entity.y + rangey;

        for (var x = minx; x < maxx; x++) {
            for (var y = miny; y < maxy; y++) {
                var key = Helpers.arrayToKey(x, y);
                var tile = Game.map.tiles[key];

                if (tile) {Game.display.draw(x - minx, y - miny, tile.ascii);};
            }
        }

        Game.display.draw(rangex, rangey, "@", "#00ff00");
    };

    Game.init = function () {
        Gen.generateMap();
        Gen.wallsPass();
        Gen.doorsPass();

        Game.initializePlayer();

        Game.drawAroundPlayer(Game.rangeX, Game.rangeY);
        Game.scheduler.add(Player, true);
        Game.engine = new ROT.Engine(Game.scheduler);
        Game.engine.start();


};

    Game.init();
}