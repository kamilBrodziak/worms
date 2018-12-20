var Worm = class {
    constructor(x, y, life, team) {
        this.img = new Image();
        this.img.src = "images/worm" + team + ".png";
        this.wormDOM = 0;
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
        this.active = true;
        this.gravityInterval;
        this.isJumping = true;
    }

    load() {
        this.wormDOM = document.createElement("IMG");
        this.wormDOM.setAttribute("class", "worm");
        this.wormDOM.setAttribute("src", "images/worm" + this.team + ".png");
        this.wormDOM.width = this.size;
        this.wormDOM.height = this.size;
        this.wormDOM.style.left = this.xPos + "px";
        this.wormDOM.style.top = this.yPos + "px";
        document.getElementById("gameBoard").appendChild(this.wormDOM);

        var imgCanvas = document.createElement('canvas');
        imgCanvas.width = this.size;
        imgCanvas.height = this.size;
        var imgCtx = imgCanvas.getContext("2d");
        var self = this;
        this.img.onload = function() {
            imgCtx.drawImage(self.img, 0, 0, self.size, self.size);

            var alpha = imgCtx.getImageData(0, 0, self.size, self.size);
            for(var i = 0, y = self.yPos; i < self.size; ++i, ++y) {
                for(var j = 0, x = self.xPos; j < self.size; ++j, ++x) {
                    var alphaC = alpha.data[i*self.size*4 + j*4 + 3];
                    if(alphaC !== 0) {
                        var chunk = [x, y];
                        self.chunks.push(chunk);
                    }
                }
            }
        };
    }

    addGravity(terrain) {
        var self = this;
        this.gravityInterval = setInterval(function() {self.changePos(terrain, 0, 1);}, 1);
    }

    addMovement(terrain) {
        var self = this;
        window.addEventListener("keydown",function(e) {
            e.preventDefault();
            self.move(e, terrain);
        });
    }

    move(e, terrain) {
        if(this.active) {
            const left = 37;
            const right = 39;
            const up = 38;
            const down = 40;
            if(e.keyCode === left) {
                this.changePos(terrain, -10, 0);
            }
            if(e.keyCode === right) {
                this.changePos(terrain, 10, 0);
            }
            if(e.keyCode === up && !this.isJumping) {
                this.jump(terrain, 120);
                // this.changePos(terrain, 0, -120);
            }
        }
    }

    jump(terrain, yMove) {
        window.clearInterval(this.gravityInterval);
        this.isJumping = true;

        var self = this;
        var jumpInterval = setInterval(function () {
            if (self.changePos(terrain, 0, -1) && yMove <= 0) {
                window.clearInterval(jumpInterval);
                self.addGravity(terrain);
            }
            yMove--;
        }, 1);
    }

    changePos(terrain, xMove, yMove) {
        if(!this.isColliding(terrain, xMove, yMove)) {
            this.yPos += yMove;
            this.xPos += xMove;
            this.wormDOM.style.top = this.yPos + "px";
            this.wormDOM.style.left = this.xPos + "px";
            for(var i = 0; i < this.chunks.length; ++i) {
                this.chunks[i][1] += yMove;
                this.chunks[i][0] += xMove;
            }
            return true;
        } else {
            this.isJumping = false;
        }
        return false;
    }

    isColliding(terrain, xMove, yMove) {
        if( terrain.chunks.length === 0 || this.chunks.length === 0 ||
            this.chunks[0][0] + xMove < 28 || this.chunks[0][0] + xMove > terrain.chunks[0].length ||
            this.chunks[0][1] + yMove < 0 || this.chunks[0][1] + yMove > terrain.chunks.length) {
                return true;
            }

        for(var i = 0; i < this.chunks.length; ++i) {
            var terrChunk = terrain.getChunk(this.chunks[i][0] + xMove, this.chunks[i][1] + yMove);
            if(terrChunk.visible) {
                return true;
            }
        }
        return false;
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
            worm.load();
            worm.addGravity(this.terrain);
            worm.addMovement(this.terrain);
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