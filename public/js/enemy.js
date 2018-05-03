var Enemy = {};

Enemy.object = function (enemyData, x, y) {
      this.x = x;
      this.y = y;
      this.name = enemyData.name;
      this.desc = enemyData.desc;
      this.ai = enemyData.ai;
      this.stats = enemyData.stats;
      this.object = enemyData.object;
      this._findAI = function () {
          switch (this.ai) {
              case "normal":
                  return Enemy.ai.normal;
              case "passive":
                  return Enemy.ai.passive;
              default:
                  return Enemy.ai.passive;
          }
      };
      this.act = this._findAI();

};

Enemy.getEnemyData = function () {
    socket.emit('enemyData');
};

document.addEventListener("DOMContentLoaded", function() {
    socket.on('enemyData', function (data) {
        for (var key in data) {
            Enemy.enemyData[key] = data[key].value;
        }
        Game.continueGen();
    });
});

Enemy.enemyData = [];

Enemy.spawnWeights = {};

Enemy.spawnWeights.compile = function () {
    for (var key in Enemy.enemyData) {
        var enemyData = Enemy.enemyData[key];
        if (typeof enemyData != 'object') {continue;}
        Enemy.spawnWeights.data[enemyData.name] = enemyData.rngweight;
    }
};

Enemy.spawnWeights.data = {};

Enemy.spawnRandom = function (x, y) {
    var randomEnemy = ROT.RNG.getWeightedValue(Enemy.spawnWeights.data);
    var enemyData = Enemy.enemyData.find(function (value) {
        return value.name === randomEnemy;
    });
    var enemyObject = new Enemy.object(enemyData, x, y);
    Game.scheduler.add(enemyObject, true);
    return enemyObject;
};

Enemy.ai = {};

Enemy.ai.normal = function () {
    var lightPasses = function(x, y) {
        var key = x+","+y;
        if (key in Game.map.tiles) { if (Game.map.tiles[key].transparent) { return (true); } }
        return false;
    };

    var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
    var fovArray = [];

    fov.compute(this.x, this.y, this.stats.sight, function(x, y, r, visibility) {
        fovArray[Helpers.arrayToKey(x,y)] = 1;
    });

    var playerPos = Helpers.arrayToKey(Player.entity.x, Player.entity.y);
    var targetLocationX;
    var targetLocationY;
    var targetLocationKey;
    if (fovArray[playerPos] === 1) {
        var passableCallback = function (x, y) {
            var key = Helpers.arrayToKey(x, y);
            var tile = Game.map.tiles[key];
            if (tile) {
                return tile.walkable;
            }
        };

        var astar = new ROT.Path.AStar(Player.entity.x, Player.entity.y, passableCallback);
        var path = [];

        astar.compute(this.x, this.y, function (x, y) {
            path.push([x,y]);
        });

        if (path[1]) {
            targetLocationX = path[1][0];
            targetLocationY = path[1][1];
        } else {
            targetLocationX = this.x;
            targetLocationY = this.y;
        }
        targetLocationKey = Helpers.arrayToKey(targetLocationX, targetLocationY);
    } else {
        var targetDirection = ROT.DIRS["8"][Math.floor(Math.random() * 8)];
        targetLocationX = this.x + targetDirection[0];
        targetLocationY = this.y + targetDirection[1];
        targetLocationKey = Helpers.arrayToKey(targetLocationX, targetLocationY);
    }

    if (Game.map.tiles[targetLocationKey].walkable && !Helpers.isEntityInTile(targetLocationX, targetLocationY)) {
        this.x = targetLocationX;
        this.y = targetLocationY;
    }
};

Enemy.ai.passive = function () {
    var targetDirection = ROT.DIRS["8"][Math.floor(Math.random() * 8)];
    var targetX = this.x + targetDirection[0];
    var targetY = this.y + targetDirection[1];
    var targetKey = Helpers.arrayToKey(targetX, targetY);

    if (Game.map.tiles[targetKey].walkable && !Helpers.isEntityInTile(targetX, targetY)) {
        this.x = targetX;
        this.y = targetY;
    }
};