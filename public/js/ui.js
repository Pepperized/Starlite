StarliteUI = {};

StarliteUI.log = [];

StarliteUI.draw = function () {
    Game.UIdisplay.clear();
    Game.UIdisplay.drawText(0,0, "Steps taken: " + Player.entity.steps);
    for (var i = 0; i < StarliteUI.log.length; i++) {
        var logitem = StarliteUI.log[i];
        var colour = (i === 0 ? "#FFFFFF" : "#696969");
        Game.UIdisplay.drawText(0,i+1, "%c{"+ colour + "}" + logitem, Game.width);
    }
};