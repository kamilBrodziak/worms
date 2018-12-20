

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

// var wormsList;

// function startGame(worms) {
//     wormsList = worms;
//     // wormsList = new worm(30, 30, "red", 80, 75);
//     gameBoard.start();
// }

// var gameBoard = {
//     canvas: document.getElementById("canvas"),
//     start: function () {
//         this.context = this.canvas.getContext("2d");
//         // this.interval = setInterval(updateGameArea, 2);        
//     },
//     stop: function () {
//         // clearInterval(this.interval);
//     },
//     clear: function () {
//         // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     }
// };

// function updateGameArea() {
//     gameBoard.clear();
//     worm.newPos();
//     worm.update();
// }



    // reload(context) {
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     var tempCanv = document.createElement("CANVAS");
    //     var tempCtx = tempCanv.getContext("2d");
    //     var img = new Image();
 
    //     img.src = this.imgSrc;
    //     var terrain = this;
    //     img.onload = function(e) {
    //         tempCtx.drawImage(img, 0, -20);
    //         loadMap(e,tempCtx ,context, terrain);
    //     };

    //     function loadMap(e, tempCtx, context, terrain) {
    //         var imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    //         for(var y = 0; y < canvas.height; ++y) {
    //             for(var x = 0; x < canvas.width; ++x) {
    //                 var imgChunk = imgData.data[y * canvas.width * 4 + x * 4 + 3]
    //                 if(!terrain.getChunk(x, y).visible &&
    //                      imgData.data[y * canvas.width * 4 + x * 4 + 3] !== 0) {
    //                         alert(terrain.getChunk(x, y).visible);

    //                         imgData.data[y * canvas.width * 4 + x * 4 + 3] = 0;
    //                 }
    //                     context.putImageData(imgData, x, y);
    //             }
    //         }
    //     }
    // }