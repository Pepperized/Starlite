
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

        //Game.seed = Helpers.randomInt(999999999);
        Game.seed = 1234;
        ROT.RNG.setSeed(Game.seed);
        Game.width = 90;
        Game.height = 40;
        Game.UIdisplay  = new ROT.Display({width: Game.width, height: 10, forceSquareRatio: false});
        Game.display = new ROT.Display({width: Game.width, height: Game.height, forceSquareRatio: true});
        Game.rangeX = Game.width / 2;
        Game.rangeY = Game.height / 2;
        Game.UIcontainer = Game.UIdisplay.getContainer();
        Game.container = Game.display.getContainer();
        document.getElementById("canvas").appendChild(Game.container);
        document.getElementById("uicanvas").appendChild(Game.UIcontainer);

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
        };

        Game.postAction = function () {
            Game.drawAroundPlayer(Game.rangeX, Game.rangeY);
            Game.engine.unlock();
            Game.scheduler.next();
            StarliteUI.draw();
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
                        Game.display.draw(x - minx, y - miny, tile.ascii, tile.color);
                    }
                }
            }

            for (var i = 0; i < Game.map.entities.length; i++) {
                var ent = Game.map.entities[i];
                if (ent) {
                    Game.display.draw(ent.x - minx, ent.y - miny, ent.object.ascii);
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
            StarliteUI.draw();
        };

        Game.init();
    }
});