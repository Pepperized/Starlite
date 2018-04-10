var Tiles = {};

Tiles.floor = function () {
    this.ascii = '.';
    this.name = 'Floor';
    this.walkable = true;
};

Tiles.wall = function () {
    this.ascii = '#';
    this.name = 'Wall';
    this.walkable = false;
};

Tiles.door = function () {
    this.ascii = 'D';
    this.name = 'Door';
    this.walkable = false;
};

Tiles.doorOpen = function () {
    this.ascii = 'd';
    this.name = 'Open Door';
    this.walkable = true;
};