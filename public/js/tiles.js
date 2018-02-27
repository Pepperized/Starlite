var Tiles = {};

Tiles.floor = function () {
    this.ascii = '.';
    this.name = 'Floor';
};

Tiles.wall = function () {
    this.ascii = '#';
    this.name = 'Wall';
};

Tiles.door = function () {
    this.ascii = 'D';
    this.name = 'Door';
};