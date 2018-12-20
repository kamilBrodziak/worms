var Worm = class {
    constructor(x, y, life, team) {
        this.img = new Image();
        this.img.src = "images/worm" + team + ".png";
        this.wormDOM = 0;
        this.healthDOM = null;
        this.xPos = x;
        this.yPos = y;
        this.size = 60;
        this.life = life;
        this.team = team;
        this.chunks = [];
        this.active = false;
        this.gravityInterval = null;
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


        this.healthDOM = document.createElement("DIV");
        this.healthDOM.setAttribute("class", "wormHealth");
        this.healthDOM.style.top = this.yPos - 20 + "px";
        this.healthDOM.style.left = this.xPos + "px";
        this.healthDOM.width = this.size;
        this.healthDOM.height = 20;
        this.healthDOM.innerHTML = Math.round(this.life);

        document.getElementById("gameBoard").appendChild(this.healthDOM);

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

    addRotation() {
        var self = this;
        var wormCords = document.getElementById("gameBoard");
        window.addEventListener("mousemove", function(e) {
            if(self.active) {
                var wormCenter=[wormCords.offsetLeft + self.xPos + self.size/2,
                     wormCords.offsetTop + self.yPos + self.size/2];
                var radians = Math.atan2(e.clientX - wormCenter[0], e.clientY - wormCenter[1]);
                var angle = (radians * (180 / Math.PI) * -1) + 90;
                self.wormDOM.style.transform = "rotate(" + angle + "deg)";
            }
        });
    }

    addGravity(terrain) {
        var self = this;
        this.gravityInterval = setInterval(function() {
                var isChanged = self.changePos(terrain, 0, 1);
                if(!isChanged) {
                    self.isJumping = false;
                }
            }, 1);      
    }

    addMovement(terrain) {
        var self = this;
        window.addEventListener("keydown",function(e) {
            if(self.life > 0) {
                e.preventDefault();
                self.move(e, terrain);
            }
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
                var self = this;
                self.jump(terrain, 120);
            }
        }
    }

    jump(terrain, yMove) {
        clearInterval(this.gravityInterval);
        this.isJumping = true;

        var self = this;
        var jumpInterval = setInterval(function () {
            self.changePos(terrain, 0, -1);
            if (yMove <= 0) {
                self.addGravity(terrain);
                clearInterval(jumpInterval);
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
            this.healthDOM.style.left = this.xPos + "px";
            this.healthDOM.style.top = this.yPos - 20 + "px";
            for(var i = 0; i < this.chunks.length; ++i) {
                this.chunks[i][1] += yMove;
                this.chunks[i][0] += xMove;
            }
            return true;
        } else {
            return false;
        }
    }

    isColliding(terrain, xMove, yMove) {
        if( terrain.chunks.length === 0 || this.chunks.length === 0) {
                return true;
            }

        for(var i = 0; i < this.chunks.length; ++i) {
            var terrChunk = terrain.getChunk(this.chunks[i][0] + xMove, this.chunks[i][1] + yMove);
            if(this.chunks[0][0] + xMove <= 0 ||
                this.chunks[i][0] + xMove >= terrain.chunks[0].length ||
                this.chunks[i][1] + yMove <= 0 || this.chunks[i][1] + yMove >= terrain.chunks.length ||
                terrChunk.visible) {
                    return true;
            }
        }
        return false;
    }

    takeDamage(health) {
        this.life -= health;
        this.healthDOM.innerHTML = Math.round(this.life);
        var color;
        if(this.life > 80) {
            color = "green";
        } else if (this.life > 60) {
            color = "greenyellow";
        } else if (this.life > 40) {
            color = "yellow";
        } else if (this.life > 20) {
            color = "orange";
        } else {
            color = "red";
        }
        this.healthDOM.style.backgroundImage = "linear-gradient(to right, " + color + " " +
            Math.round(this.life) + "%, transparent " + Math.round(this.life) + "%)"; 
        if(this.life <= 0) {
            return this.die();
        }
        return false;
    }

    hasChunk(x, y) {
        for(var i = 0; i < this.chunks.length; ++i) {
            if(this.chunks[i][0] === x && this.chunks[i][1] === y) {
                return true;
            }
        }
        return false;
    }

    die() {
        this.isJumping = true;
        this.healthDOM.parentNode.removeChild(this.healthDOM);
        this.active = false;
        return true;
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
            worm.addRotation();
        }
        return this.wormList;
    }

    hitWorm(xBullet, yBullet) {
        for(var i = 0; i < this.wormList.length; ++i) {
            if(this.wormList[i].hasChunk(xBullet, yBullet)) {
                if(this.wormList[i].takeDamage(0.02)) {
                    this.wormList.splice(i, 1);
                }
            }
        }
    }
};