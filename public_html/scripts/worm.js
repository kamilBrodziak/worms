class Worm {
    constructor(x, y, size, team) {
        this.wormDOM = null;
        this.healthDOM = null;
        this.xPos = x;
        this.yPos = y;
        this.size = size;
        this.life = 100;
        this.team = team;
        this.chunks = [];
        this.active = false;
    }

    load(terrain) {
        this.createWormDOM();
        this.createHealthDOM();
        this.loadChunks(terrain);
    }

    createWormDOM() {
        this.wormDOM = document.createElement("IMG");
        this.wormDOM.setAttribute("class", "worm");
        this.wormDOM.setAttribute("src", "images/worm" + this.team + ".png");
        this.wormDOM.width = this.size;
        this.wormDOM.height = this.size;
        this.wormDOM.style.left = this.xPos + "px";
        this.wormDOM.style.top = this.yPos + "px";
        document.getElementById("gameBoard").appendChild(this.wormDOM);
    }

    createHealthDOM() {
        this.healthDOM = document.createElement("DIV");
        this.healthDOM.setAttribute("class", "wormHealth");
        this.healthDOM.style.top = this.yPos - 10 + "px";
        this.healthDOM.style.left = this.xPos + "px";
        this.healthDOM.width = this.size;
        this.healthDOM.height = this.size/3;
        this.healthDOM.innerHTML = Math.round(this.life);
        document.getElementById("gameBoard").appendChild(this.healthDOM);
    }

    loadChunks(terrain) {
        const imgCanvas = document.createElement('canvas');
        imgCanvas.width = this.size;
        imgCanvas.height = this.size;
        const imgCtx = imgCanvas.getContext("2d");
        const self = this;
        this.wormDOM.onload = function() {
                self.chunks = [];
                imgCtx.drawImage(self.wormDOM, 0, 0, self.size, self.size);
    
                const wormRgba = imgCtx.getImageData(0, 0, self.size, self.size);
                for(let i = 0, y = self.yPos; i < self.size; ++i, ++y) {
                    for(let j = 0, x = self.xPos; j < self.size; ++j, ++x) {
                        let aValueRGBA = wormRgba.data[i*self.size*4 + j*4 + 3];
                        if(aValueRGBA !== 0) {
                            terrain.chunks[y][x].isWormChunk = true;
                            let chunk = [x, y];
                            self.chunks.push(chunk);
                        }
                    }
                }            
        };
    }

    getChunks() {
        return this.chunks;
    }

    hasChunk(x, y) {
        for(let i = 0; i < this.chunks.length; ++i) {
            if(this.chunks[i][0] === x && this.chunks[i][1] === y) {
                return true;
            }
        }
        return false;
    }
}