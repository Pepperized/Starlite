var Enemy = {};


Enemy.object = function (enemyData, x, y) {
      this.x = x;
      this.y = y;
      this.name = enemyData.name;
      this.desc = enemyData.desc;
      this.ai = enemyData.ai;
      this.stats = enemyData.stats;
      this.object = enemyData.object;
};

Enemy.getEnemyData = function () {
    socket.emit('enemyData');
};

document.addEventListener("DOMContentLoaded", function() {
    socket.on('enemyData', function (data) {
        for (var key in data) {
            Enemy.enemyData[key] = data[key].value;
        }
        console.log(Enemy.enemyData);
        Game.continueGen();
    });
});

Enemy.enemyData = [];

Enemy.spawnWeights = {};

Enemy.spawnWeights.compile = function () {
    for (var key in Enemy.enemyData) {
        var enemyData = Enemy.enemyData[key];
        if (typeof enemyData != 'object') {continue;}
        console.log(enemyData["rngweight"]);
        Enemy.spawnWeights.data[enemyData.name] = enemyData.rngweight;
    }
};

Enemy.spawnWeights.data = {};

Enemy.spawnRandom = function (x, y) {
    var randomEnemy = ROT.RNG.getWeightedValue(Enemy.spawnWeights.data);
    console.log(randomEnemy);
    var enemyData = Enemy.enemyData.find(function (value) {
        return value.name === randomEnemy;
    });
    console.log(enemyData);
    return new Enemy.object(enemyData, x, y);
};