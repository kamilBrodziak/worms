var Worm = class {
    constructor(x, y, life, team) {
        this.xPos = x;
        this.yPos = y;
        this.size = 80;
        this.life = life;
        this.team = team;
        this.speedX = 0;
        this.speedY = 0;    
        this.gravity = 0.05;
        this.gravitySpeed = 0;
        this.chunks = [];
    }

    load(context, terrain) {
        var img = new Image();
        img.src = "images/worm" + this.team + ".png";
        const size = this.size;
        const xPos = this.xPos;
        const yPos = this.yPos;
        var chunks = this.chunks;
        img.onload = function() {
            context.drawImage(img, xPos, yPos, size, size);
            var alpha = context.getImageData(xPos, yPos, size, size);
            for(var i = 0, y = yPos; i < size; ++i, ++y) {
                for(var j = 0, x = xPos; j < size; ++j, ++x) {
                    var alphaC = alpha.data[i*size*4 + j*4 + 3];

                    if(alphaC !== 0) {
                        var chunk = [x, y];
                        terrain.chunks[y][x].isWormChunk = true;
                        chunks.push(chunk);
                    }
                }
            }
        };
    };

    hasChunk(x, y) {
        for(var chunk in this.chunks) {
            if(chunk[0] === x && chunk[1] === y) {
                return true;
            }
        }
        return false;
    }


    update() {
        ctx = gameBoard.context;
        ctx.drawImage(this.image, this.x, this.y);
    }
    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        hitBottom();
    }
    hitBottom() {
        var rockbottom = gameBoard.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
};

var Worms = class {
    constructor(context, terrain) {
        this.wormList = [];
        this.context = context;
        this.terrain = terrain;
    }

    loadWorms(count, size, team) {
        for(var i = 0, xPos = 0; i < count; ++i, xPos+=100) {
            var worm = new Worm(xPos, 0, size, team);
            this.wormList.push(worm);

            worm.load(this.context, this.terrain);
        }
        return this.wormList;
    }

    isWormChunk(x, y) {
        for(var i = 0; i < this.wormList.length; ++i) {
            var worm = this.wormList[i];
            if(worm.hasChunk(x, y)) {
                return true;
            }
        }
        return false;
    }

}