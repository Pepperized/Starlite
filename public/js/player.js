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

