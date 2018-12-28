class Movement {
    constructor(worm, terrain) {
        this.worm = worm;
        this.terrain = terrain;
        this.isFalling = true;
        this.gravityInterval = null;
    }

    addRotation() {
        const gameBoard = document.getElementById("gameBoard");
        let wormCenter = null;
        let radians = null;
        let angle = null;
        var self = this;
        window.addEventListener("mousemove", function(e) {
            if(self.worm.active) {
                wormCenter = [gameBoard.offsetLeft + self.worm.xPos + self.worm.size/2,
                     gameBoard.offsetTop + self.worm.yPos + self.worm.size/2];
                radians = Math.atan2(e.clientX - wormCenter[0], e.clientY - wormCenter[1]);
                angle = (radians * (180 / Math.PI) * -1) + 90;
                self.worm.wormDOM.style.transform = "rotate(" + angle + "deg)";
            }
        });
    }

    addMovement() {
        let keyMap = {37: false, 38: false, 39: false};
        const self = this;
        window.addEventListener("keyup", function(e) {
            keyMap[e.keyCode] = (e.type === 'keydown');
            if(self.worm.active) {
                e.preventDefault();
                self.move(keyMap);
            }
        });
        window.addEventListener("keydown", function(e) {
            keyMap[e.keyCode] = (e.type === 'keydown');
            if(self.worm.active) {
                e.preventDefault();
                self.move(keyMap);
            }
        });
    }

    addGravity() {
        const self = this;
        let isChanged = null;
        this.gravityInterval = setInterval(function() {
            isChanged = self.changePos(0, 1);
            if(!isChanged) {
                self.isFalling = false;
            }
        }, 1);
    }

    isColliding(xMove, yMove) {
        if( this.terrain.getChunks().length === 0 || this.worm.getChunks().length === 0) {
            return true;
        }

        for(let i = 0; i < this.worm.getChunks().length; ++i) {
            let terrChunk = this.terrain.getChunk(
                this.worm.getChunks()[i][0] + xMove, this.worm.getChunks()[i][1] + yMove);
            if(this.worm.getChunks()[0][0] + xMove <= 0 ||
                this.worm.getChunks()[i][0] + xMove >= this.terrain.getChunks()[0].length ||
                this.worm.getChunks()[i][1] + yMove <= 0 ||
                this.worm.getChunks()[i][1] + yMove >= this.terrain.getChunks().length ||
                terrChunk.visible) {
                    return true;
            }
        }
        return false;
    }

    changePos(xMove, yMove) {
        if(!this.isColliding(xMove, yMove)) {
            this.worm.yPos += yMove;
            this.worm.xPos += xMove;
            this.worm.wormDOM.style.top = this.worm.yPos + "px";
            this.worm.wormDOM.style.left = this.worm.xPos + "px";
            this.worm.healthDOM.style.left = this.worm.xPos + "px";
            this.worm.healthDOM.style.top = this.worm.yPos - 10 + "px";
            for(let i = 0; i < this.worm.chunks.length; ++i) {
                this.terrain.chunks[this.worm.chunks[i][1]][this.worm.chunks[i][0]].isWormChunk = false;
                this.worm.chunks[i][1] += yMove;
                this.worm.chunks[i][0] += xMove;
                this.terrain.chunks[this.worm.chunks[i][1]][this.worm.chunks[i][0]].isWormChunk = true;
            }
            return true;
        } else {
            return false;
        }
    }

    jump(yMove) {
        clearInterval(this.gravityInterval);
        this.isFalling = true;
        const self = this;

        let jumpInterval = setInterval(function () {
            self.changePos(0, -1);
            if (yMove <= 0) {
                self.addGravity();
                clearInterval(jumpInterval);
            }
            yMove--;
        }, 1);
    }

    move(keyMap) {
        const left = 37;
        const right = 39;
        const up = 38;

        if(keyMap[left]) {
            this.changePos(-10, 0);
        }
        if(keyMap[right]) {
            this.changePos(10, 0);
        }
        if(keyMap[up] && !this.isFalling) {
            this.jump(120);
        }
    }
}