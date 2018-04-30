Player = {};

Player._entity = function (x, y) {
    this.ascii = "@";
    this.x = x;
    this.y = y;
    this.draw = function (range) {
        Game.display.draw(range + 1, range + 1, "@", "#00ff00");
    };
    this.drawSimple = function () {
        Game.display.draw(this.x, this.y, "@", "#00ff00");
    };
    this.steps = 0;
};

Player.entity = null;

Player.createPlayerRandomly = function () {
    var keys = Object.keys(Game.map.floor);
    var key = keys[Math.floor(ROT.RNG.getUniform() * keys.length)];
    var parts = Helpers.keyToArray(key);
    var x = parts[0];
    var y = parts[1];
    Player.createPlayer(x, y);
    Player.entity.draw();
};

Player.createPlayer = function (x, y) {
    Player.entity = new Player._entity(x, y);
};

Player.act = function () {
    Game.engine.lock();
    window.addEventListener("keydown", Player.handleInput, true);
};

Player.handleInput = function (ev) {
        var code = ev.keyCode;
        if (Player.directionPicker.waitingForDirection == true) {console.log("caught"); return;}

        for (var key in Player.commands) {
            var command = Player.commands[key];
            if (code == command.keyCode) {
                console.log("Identified command as " + key);
                command.action();
                return;
            }

        }

        if (!(code in Helpers.keyMap)) { return; }
        var diff = ROT.DIRS[8][Helpers.keyMap[code]];
        var newX = Player.entity.x + diff[0];
        var newY = Player.entity.y + diff[1];

        var newKey = newX + "," + newY;
        if (!(newKey in Game.map.tiles)) { return; }
        if (Game.map.tiles[newKey].walkable == false) { return; }

        Game.display.draw(Player.entity.x, Player.entity.y, Game.map.tiles[Player.entity.x+","+Player.entity.y].ascii);
        Player.entity.x = newX;
        Player.entity.y = newY;
        Game.drawAroundPlayer(Game.rangeX, Game.rangeY);
        Player.entity.steps++;
        document.getElementById('ui').innerText = "Steps taken: " + Player.entity.steps.toString();
        window.removeEventListener("keydown", this, true);
        Helpers.displayLog("");
        Game.engine.unlock();
};

Player.commands = {};

Player.commands.open = {
    keyCode: 79,
    action: function () {
        Player.directionPicker.start(this);
    },
    actionAfterDir: function (dir) {
        Player.directionPicker.waitingForDirectionCaller = null;
        Player.directionPicker.waitingForDirection = false;
        Helpers.displayLog("Opening door...");
        var truedir = ROT.DIRS["8"][Helpers.keyMap[dir]];
        var targetx = Player.entity.x + truedir[0];
        var targety = Player.entity.y + truedir[1];
        var targetKey = Helpers.arrayToKey(targetx, targety);
        if (Game.map.tiles[targetKey].ascii == 'D') {
            Game.map.tiles[targetKey] = new Tiles.doorOpen();
            Helpers.displayLog("Door opened!");
        }
        Game.drawAroundPlayer(Game.rangeX, Game.rangeY);
        Game.engine.unlock();
    }
};

Player.commands.close = {
    keyCode: 67,
    action: function () {
        Player.directionPicker.start(this);
    },
    actionAfterDir: function (dir) {
        Player.directionPicker.waitingForDirectionCaller = null;
        Player.directionPicker.waitingForDirection = false;
        Helpers.displayLog("Closing door...");
        var truedir = ROT.DIRS["8"][Helpers.keyMap[dir]];
        var targetx = Player.entity.x + truedir[0];
        var targety = Player.entity.y + truedir[1];
        var targetKey = Helpers.arrayToKey(targetx, targety);
        if (Game.map.tiles[targetKey].ascii == 'd') {
            Game.map.tiles[targetKey] = new Tiles.door();
            Helpers.displayLog("Door closed!");
        }
        Game.drawAroundPlayer(Game.rangeX, Game.rangeY);
        Game.engine.unlock();
    }
};

Player.directionPicker = {};
Player.directionPicker.waitingForDirection = false;
Player.directionPicker.waitingForDirectionCaller = null;

Player.directionPicker.start = function (caller) {
      Helpers.displayLog("Open where?");
      Player.directionPicker.waitingForDirection = true;
      Player.directionPicker.waitingForDirectionCaller = caller;
      window.addEventListener("keydown", Player.directionPicker.handler, true);
};

Player.directionPicker.handler = function (ev) {
    var keyCode = ev.keyCode;
    window.removeEventListener("keydown", Player.directionPicker.handler, true);
    if (!(keyCode in Helpers.keyMap)) {Player.waitingForDirection = false; Player.directionPicker.waitingForDirectionCaller = null; return;}
    if (Player.directionPicker.waitingForDirectionCaller != null) {Player.directionPicker.waitingForDirectionCaller.actionAfterDir(keyCode)}
};