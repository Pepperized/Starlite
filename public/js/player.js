Player = {};

Player._entity = function (x, y) {
    this.ascii = "@";
    this.x = x;
    this.y = y;
    this.draw = function () {
        Game.display.draw(this.x, this.y, "@", "#00ff00");
    };
};

Player.entity = null;

Player.createPlayerRandomly = function () {
    var keys = Object.keys(Game.map.floor);
    console.log(keys);
    console.log(keys.length);
    var key = keys[Math.floor(ROT.RNG.getUniform() * keys.length)];
    console.log(key);
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
        console.log(code);

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
        Player.entity.draw();
        window.removeEventListener("keydown", this, true);
        Game.engine.unlock();
};
