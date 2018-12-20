

function drawBoard() {
    var canvas = document.getElementById("canvas");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return canvas;
}

function createTerrain(context) {
    var terrain = new Terrain(0, context);
    return terrain;
}


var Terrain = class {
    constructor(imgCount, context) {
        this.imgCount = imgCount;
        this.imgSrc = "images/map" + (Math.random() * this.imgCount + 4) + ".png";
        this.chunks = [];
        this.context = context;
    }

    getChunk(x, y) { 
        return this.chunks[y][x];
    }

    load() {
        var canvas = document.getElementById("canvas");
        var img = new Image();
        img.src = this.imgSrc;
        var chunks = this.chunks;
        var ctx = this.context;
        img.onload = function() {
            ctx.drawImage(img, -75, 10, canvas.width + 220, canvas.height + 100);
            var alpha = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for(var i = 0; i < canvas.height; ++i) {
                var x = [];
                chunks.push(x);
                for(var j = 0; j < canvas.width; ++j) {
                    var alphaC = alpha.data[i*canvas.width*4 + j*4 + 3];
                    chunks[i].push(
                        {
                            visible: (alphaC === 0) ? false : true,
                            isWormChunk: false
                        }
                    );
                }
            }
        };
    }
};