
var Game = {};

var socket = io.connect("http://localhost:8080");

document.addEventListener("DOMContentLoaded", function(){
    // Handler when the DOM is fully loaded
    if (!ROT.isSupported()) {
        console.log("The rot.js library isn't supported by your browser.");
    } else {
        // Good to go!

        Game.player = null;

        Game.seeds = [];

        Game.initializePlayer = function () {
            Player.createPlayerRandomly();
        };

        //Game.seed = Helpers.randomInt(999999999);
        Game.seed = 1234;
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

        Game.entity = {
            enemy: 0,
            item: 1
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
                    Game.display.draw(ent.x - minx, ent.y - miny, ent.object.ascii, ent.object.color);
                }
            }

            Game.display.draw(rangex, rangey, "@", "#00ff00");
        };

        Game.mainMenu = function () {
            Helpers.drawTextCenter(Game.display, Game.width/2, 3, "Starlite", "blue", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 5, "Today's Challenge: ", "gray", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 6, "[D]aily Challenge", "white", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 7, "[R]andom Start", "white", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 8, "[P]revious Challenges", "white", "");
            window.addEventListener("keydown", Game.mainMenuInput, true);
        };

        Game.mainMenuInput = function (ev) {
            var code = ev.keyCode;
            switch (code) {
                //d
                case 68:
                    Game.init();
                    break;
                //r
                case 82:
                    Game.seed = Helpers.randomInt(999999999);
                    Game.init();
                    break;
                //p
                case 80:
                    break;
                default:
                    return;
            }
            window.removeEventListener("keydown", this, true);
        };

        Game.init = function () {
            ROT.RNG.setSeed(Game.seed);
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

        socket.on('seeds', function (data) {
            Game.seeds = data;
            console.log(Game.seeds);
            Game.mainMenu();
        });

        socket.emit('seeds');
    }
});