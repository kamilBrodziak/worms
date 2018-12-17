// body.onload = drawMap();

function drawMap() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var img = new Image();
    img.src = getRandomMapUrl(1);


    function getRandomMapUrl(imgCount) {
        return "..images/map" + (Math.random() * imgCount + 1) + ".png";
    }
}