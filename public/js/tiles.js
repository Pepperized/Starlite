var Tiles = {};

Tiles.floor = function () {
    this.ascii = '.';
    this.name = 'Floor';
    this.walkable = true;
    this.color = "#696969";
    this.transparent = true;
};

Tiles.wall = function () {
    this.ascii = '#';
    this.name = 'Wall';
    this.walkable = false;
    this.color = "#D3D3D3";
    this.transparent = false;
};

Tiles.door = function () {
    this.ascii = 'D';
    this.name = 'Door';
    this.walkable = false;
    this.color = "#966F33";
    this.transparent = false;
};

Tiles.doorOpen = function () {
    this.ascii = 'd';
    this.name = 'Open Door';
    this.walkable = true;
    this.color = "#966F33";
    this.transparent = true;
};