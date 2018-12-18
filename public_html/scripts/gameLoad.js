window.onload = gameLoad;


function gameLoad() {
    var canvas = drawBoard();
    var context = canvas.getContext("2d");
    var terrain = createTerrain(context);
    terrain.load(canvas);

    var worm = new Worm(0, 0, 100, 2);
    worm.load(context);
}