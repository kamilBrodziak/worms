window.onload = gameLoad;


function gameLoad() {
    var canvas = drawBoard();
    var context = canvas.getContext("2d");
    var terrain = createTerrain(context);
    terrain.load(canvas);
    setTimeout(function() {
        var worms = new Worms(context, terrain);
        var wormsList = worms.loadWorms(5, 100, 2);
        turns(wormsList);
        var destructionRadius = canvas.offsetWidth/40;
        var bulletsMechanism = new BulletsMechanism(canvas, terrain, destructionRadius, worms);
        bulletsMechanism.load();
    }, 50);

}

function turns(wormsList) {
    if(wormsList.length !== 0) {
        wormsList[0].active = true;
        var i = 0;
        setInterval(function() {
                wormsList[i%wormsList.length].active = false;
                wormsList[++i%wormsList.length].active = true;
        }, 4000);
    }
}