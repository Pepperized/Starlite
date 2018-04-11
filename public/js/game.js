
var Game = {};

var socket = io.connect("http://localhost:8080");

document.addEventListener("DOMContentLoaded", function(){
    // Handler when the DOM is fully loaded
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
        document.getElementById("canvas").appendChild(Game.container);

        Game.map = {
            tiles: {},
            entities: {},
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

                    if (tile) {
                        Game.display.draw(x - minx, y - miny, tile.ascii);
                    }
                }
            }

            for (var x = minx; x < maxx; x++) {
                for (var y = miny; y < maxy; y++) {
                    var key = Helpers.arrayToKey(x, y);
                    var ent = Game.map.entities[key];

                    if (ent) {
                        Game.display.draw(x - minx, y - miny, ent.object.ascii);
                    }
                }
            }

            Game.display.draw(rangex, rangey, "@", "#00ff00");
        };

        Game.init = function () {
            Gen.generateMap();
            Gen.wallsPass();
            Gen.doorsPass();
            Enemy.getEnemyData();
        };

        Game.continueGen = function () {
            Enemy.spawnWeights.compile();
            Gen.entityPass();

            Game.initializePlayer();

            Game.drawAroundPlayer(Game.rangeX, Game.rangeY);
            Game.scheduler.add(Player, true);
            Game.engine = new ROT.Engine(Game.scheduler);
            Game.engine.start();
        };

        Game.init();
    }
});