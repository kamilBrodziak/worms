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

    getChunks() {
        return this.chunks;
    }

    load(canvas) {
        const img = new Image();
        img.src = this.imgSrc;
        let chunks = this.chunks;
        const ctx = this.context;
        img.onload = function() {
            ctx.drawImage(img, -75, 10, canvas.width + 220, canvas.height + 100);
            const mapRgba = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let aValueRgba = null;
            for(let i = 0; i < canvas.height; ++i) {
                let x = [];
                chunks.push(x);
                for(let j = 0; j < canvas.width; ++j) {
                    aValueRgba = mapRgba.data[i*canvas.width*4 + j*4 + 3];
                    chunks[i].push(
                        {
                            visible: aValueRgba !== 0,
                            isWormChunk: false
                        }
                    );
                }
            }
        };
    }

    loadDiePng(worm) {
        const imgCanvas = document.createElement('canvas');
        imgCanvas.width = worm.size;
        imgCanvas.height = worm.size;
        const imgCtx = imgCanvas.getContext("2d");
        const self = this;
        worm.wormDOM.onload = function() {
            imgCtx.drawImage(worm.wormDOM, 0, 0, worm.size, worm.size);
            const wormRgba = imgCtx.getImageData(0, 0, worm.size, worm.size);
            let aValueRgba = null;
            let currRgbaIndex = null;
            for(let i = 0, y = worm.yPos; i < worm.size; ++i, ++y) {
                for(let j = 0, x = worm.xPos; j < worm.size; ++j, ++x) {
                    aValueRgba = wormRgba.data[i*worm.size*4 + j*4 + 3];
                    if(aValueRgba !== 0) {
                        self.chunks[y][x].visible = true;
                        currRgbaIndex = i * worm.size*4 + j*4;
                        self.context.fillStyle='rgba(' + wormRgba.data[currRgbaIndex] + "," +
                            wormRgba.data[currRgbaIndex + 1] + "," +
                            wormRgba.data[currRgbaIndex + 2] + "," +
                            wormRgba.data[currRgbaIndex + 3] + ")";
                        self.context.fillRect(x,y,1,1);
                    }
                }
            }
        };
    }
};