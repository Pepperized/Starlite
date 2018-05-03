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
    this.stats = {
        health: 100,
        attack: 10
    };
    this.changeHealth = function (amount) {
        this.stats.health += amount;
    };
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
        if (Player.directionPicker.waitingForDirection === true) {console.log("caught"); return;}

        for (var key in Player.commands) {
            var command = Player.commands[key];
            if (code === command.keyCode) {
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
        if (Game.map.tiles[newKey].walkable === false) { Helpers.displayLog("Can't walk there"); return; }
        if (Helpers.isEntityInTile(newX, newY)) {
            var entity = Helpers.findEntityInTile(newX, newY);
            if (entity.entType === Game.entity.enemy) {
                var x = entity.x;
                var y = entity.y;
                var attack = Player.entity.stats.attack;
                Helpers.displayLog("You hit the " + entity.name + " for " + attack + " damage.");
                entity.stats.health -= attack;
                if (entity.stats.health <= 0) {
                    Helpers.displayLog("You killed the " + entity.name + "!");
                    Helpers.removeFromArray(Game.map.entities, entity);
                    Game.scheduler.remove(entity);
                    var viewCoOrd = Helpers.worldToViewCoords(x, y);
                    Game.display.draw(viewCoOrd[0], viewCoOrd[1], Game.map.tiles[Helpers.arrayToKey(x,y)].ascii, Game.map.tiles[Helpers.arrayToKey(x,y)].color, "#8A0707");
                }
                Game.postAction();
            }
            return;
        }

        Game.display.draw(Player.entity.x, Player.entity.y, Game.map.tiles[Player.entity.x+","+Player.entity.y].ascii);
        Player.entity.x = newX;
        Player.entity.y = newY;
        Player.entity.steps++;
        window.removeEventListener("keydown", this, true);
        Game.postAction();
};

Player.commands = {};

Player.commands.open = {
    keyCode: 79,
    action: function () {
        Helpers.displayLog("Open in what direction?");
        Player.directionPicker.start(this);
    },
    actionAfterDir: function (dir) {
        Player.directionPicker.waitingForDirectionCaller = null;
        Player.directionPicker.waitingForDirection = false;
        var truedir = ROT.DIRS["8"][Helpers.keyMap[dir]];
        var targetx = Player.entity.x + truedir[0];
        var targety = Player.entity.y + truedir[1];
        var targetKey = Helpers.arrayToKey(targetx, targety);
        if (Game.map.tiles[targetKey].ascii == 'D') {
            Game.map.tiles[targetKey] = new Tiles.doorOpen();
            Helpers.displayLog("Door opened!");
        }
        Game.postAction();
    }
};

Player.commands.close = {
    keyCode: 67,
    action: function () {
        Helpers.displayLog("Close in what direction?");
        Player.directionPicker.start(this);
    },
    actionAfterDir: function (dir) {
        Player.directionPicker.waitingForDirectionCaller = null;
        Player.directionPicker.waitingForDirection = false;
        var truedir = ROT.DIRS["8"][Helpers.keyMap[dir]];
        var targetx = Player.entity.x + truedir[0];
        var targety = Player.entity.y + truedir[1];
        var targetKey = Helpers.arrayToKey(targetx, targety);
        if (Game.map.tiles[targetKey].ascii == 'd') {
            Game.map.tiles[targetKey] = new Tiles.door();
            Helpers.displayLog("Door closed!");
        }
        Game.postAction();
    }
};

Player.directionPicker = {};
Player.directionPicker.waitingForDirection = false;
Player.directionPicker.waitingForDirectionCaller = null;

Player.directionPicker.start = function (caller) {
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