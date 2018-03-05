var Game = {};
if (!ROT.isSupported()) {
    console.log("The rot.js library isn't supported by your browser.");
} else {
    // Good to go!

    Game.player = null;

    Game.initializePlayer = function () {

    };

    Game.seed = 12345;
    ROT.RNG.setSeed(Game.seed);

    Game.display = new ROT.Display({forceSquareRatio: true,});
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

    Game.init = function () {
        Gen.generateMap();
        Gen.wallsPass();
        Gen.doorsPass();

        Game.initializePlayer();

        Game.drawWholeMap();

        Game.scheduler.add(Player, true);
        Game.engine = new ROT.Engine(Game.scheduler);
        Game.engine.start();

        Player.createPlayerRandomly();
    };

    Game.init();
}