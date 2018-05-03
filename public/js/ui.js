StarliteUI = {};

StarliteUI.log = [];

StarliteUI.draw = function () {
    Game.UIdisplay.clear();
    Game.UIdisplay.drawText(0,0, "Steps taken: " + Player.entity.steps, 45);
    for (var i = 0; i < StarliteUI.log.length; i++) {
        var logitem = StarliteUI.log[i];
        var colour = (i === 0 ? "#FFFFFF" : "#696969");
        Game.UIdisplay.drawText(0,i+1, "%c{"+ colour + "}" + logitem, 45);
    }
    Game.UIdisplay.drawText(45, 0, "Status");
    Game.UIdisplay.drawText(45, 1, "Health: " + Player.entity.stats.health);
    Game.UIdisplay.drawText(45, 2, "Attack: " + Player.entity.stats.attack);
    Game.UIdisplay.drawText(45, 9, "Score: " + Player.entity.stats.score);
};