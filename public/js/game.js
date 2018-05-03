
var Game = {};

var socket = io.connect("http://localhost:8080");

document.addEventListener("DOMContentLoaded", function(){
    // Handler when the DOM is fully loaded
    if (!ROT.isSupported()) {
        console.log("The rot.js library isn't supported by your browser.");
    } else {
        // Good to go!

        Game.player = null;
        Game.daily = false;
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
            Game.display.clear();
            Game.UIdisplay.clear();
            Helpers.drawTextCenter(Game.display, Game.width/2, 3, "Starlite", "blue", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 5, "Today's Challenge: " + Game.seeds[0].value.seedName, "gray", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 6, "[D]aily Challenge", "white", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 7, "[H]igh Scores", "white", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 10, "[R]andom Start", "white", "");
            Helpers.drawTextCenter(Game.display, Game.width/2, 11, "[P]revious Challenges", "white", "");
            window.addEventListener("keydown", Game.mainMenuInput, true);
        };

        Game.mainMenuInput = function (ev) {
            var code = ev.keyCode;
            switch (code) {
                //d
                case 68:
                    if (!Game.seeds[0]) {return;}
                    Game.seed = Game.seeds[0].value.seed;
                    Game.daily = true;
                    Game.init();
                    break;
                //h
                case 72:
                    Game.highScores();
                    break;
                //r
                case 82:
                    Game.seed = Helpers.randomInt(999999999);
                    Game.daily = false;
                    Game.init();
                    break;
                //p
                case 80:
                    Game.previousChallenges();
                    break;
                default:
                    return;
            }
            window.removeEventListener("keydown", this, true);
        };

        Game.highScores = function () {
            Game.display.clear();
            Game.UIdisplay.clear();

            Helpers.drawTextCenter(Game.display, Game.width/2, 5, "High Scores", "gold");
            var challengeSeeds = Game.seeds.slice(0, 9);
            for (var i = 0; i < challengeSeeds.length; i++) {
                var seedData = challengeSeeds[i].value;
                var date = new Date(JSON.parse(seedData.date));
                var dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                Game.display.drawText(10, i + 6, "%c{white}" + dateString + " - " + seedData.seedName  + " - " + (seedData.highscore ? "HS: " + seedData.highscore.name + " - " + seedData.highscore.score : "Unattempted"));
            }
            Helpers.drawTextCenter(Game.display, Game.width/2, 25, "[Esc] to return.", "gray");

            window.addEventListener("keydown", function (ev) {
                var keycode = ev.keyCode;
                if (keycode === 27) {
                    Game.mainMenu();
                } else {return;}
                window.removeEventListener("keydown", this, true)
            }, true);
        };

        Game.previousChallenges = function () {
            Game.display.clear();
            Game.UIdisplay.clear();
            var challengeSeeds = Game.seeds.slice(0, 9);
            Helpers.drawTextCenter(Game.display, Game.width/2, 5, "Previous Challenges:", "gray", "");
            for (var i = 1; i < challengeSeeds.length; i++) {
                var seedData = challengeSeeds[i].value;
                var date = new Date(JSON.parse(seedData.date));
                var dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                Game.display.drawText(10, i + 6, "%c{white}[" + i + "]  %c{gray}" + seedData.seedName + " - " + dateString + " - " + (seedData.highscore ? "%c{green}HS: " + seedData.highscore.name + " - " + seedData.highscore.score : "%c{red}Unattempted"));
            }
            Helpers.drawTextCenter(Game.display, Game.width/2, 25, "[Esc] to return.", "gray");
            window.addEventListener("keydown", Game.previousChallengesHandler);
        };

        Game.previousChallengesHandler = function (ev) {
            var keycode = ev.keyCode;
            if (keycode === 27) {
                Game.mainMenu();
            } else if (keycode >= 49 && keycode <= 57) {
                var charcode = keycode - 48;
                if (Game.seeds[charcode]) {
                    Game.seed = Game.seeds[charcode].value.seed;
                    Game.daily = false;
                    Game.init();
                } else {
                    return;
                }
            }
            window.removeEventListener("keydown", this, true);
        };

        Game.init = function () {
            Game.display.clear();
            Game.UIdisplay.clear();
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

        Game.endGame = function () {
            var score = Player.entity.stats.score;
            Game.map = {};
            Game.scheduler = null;
            Player.act = function () {};
            Game.display.clear();
            Game.UIdisplay.clear();
            Helpers.drawTextCenter(Game.display, Game.width/2, Game.height/2, "Game Over", "red");
            Helpers.drawTextCenter(Game.display, Game.width/2, Game.height/2 +1, "Your score was " + score, "white");

            if (Game.daily) {
                if (Game.seeds[0].value.highscore) {
                    if (Game.seeds[0].value.highscore.score >= score) {return;}
                    var name = prompt("Please enter your name");
                    var id = Game.seeds[0].value._id;
                    var rev = Game.seeds[0].value._rev;
                    socket.emit('highscore', [name,score,id,rev]);
                } else {
                    var name = prompt("Please enter your name");
                    var id = Game.seeds[0].value._id;
                    var rev = Game.seeds[0].value._rev;
                    socket.emit('highscore', [name,score,id,rev]);
                }
            }
        };

        socket.on('seeds', function (data) {
            Game.seeds = data;
            Game.seeds.sort( function (a, b) {
                return new Date(JSON.parse(b.key)) - new Date(JSON.parse(a.key));
            });
            Game.mainMenu();
        });

        socket.emit('seeds');
    }
});