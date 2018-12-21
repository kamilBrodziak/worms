var BulletsMechanism = class {

    constructor(canvas, terrain, destructionRadius, worms) {
        this.canvas = canvas;
        this.terrain = terrain;
        this.worms = worms;
        this.destructionRadius = destructionRadius;
        this.context = canvas.getContext("2d");
    } 

    hitChunks(x, y) {
        for(var xPlus = x, xMinus = x, k = this.destructionRadius;
          xPlus < this.destructionRadius + x; ++xPlus, --xMinus) {
            for(var yPlus = y, yMinus = y; yPlus < y + k; ++yPlus, --yMinus) {
                this.destroyChunk(xPlus, yMinus, this.terrain, this.context, this.worms);
                this.destroyChunk(xPlus, yPlus, this.terrain, this.context, this.worms);
                this.destroyChunk(xMinus, yMinus, this.terrain, this.context, this.worms);
                this.destroyChunk(xMinus, yPlus, this.terrain, this.context, this.worms);
            }
            //move to function:
            if(xPlus >= x + this.destructionRadius/6 &&
                 xPlus < x + 2*this.destructionRadius/6 && xPlus%3 === 0) {
                --k;
            } else if(xPlus >= x + 2*this.destructionRadius/6 &&
                 xPlus < x + 3*this.destructionRadius/6 && xPlus%2 === 0) { 
                --k;
            } else if(xPlus >= x + 3*this.destructionRadius/6 &&
                 xPlus < x + 4*this.destructionRadius/6) {
                --k;
            } else if(xPlus >= x + 4*this.destructionRadius/6 &&
                 xPlus < x + 5*this.destructionRadius/6) {
                k -= 2;
            } else if(xPlus >= x + 5*this.destructionRadius/6) {
                k -= 3;
            }
        }
    }

    destroyChunk(x, y, terrain, context, worms) {
        if(terrain.chunks[y][x].visible) {
            context.clearRect(x, y, 1, 1);
            terrain.chunks[y][x].visible = false;
        }
        worms.hitWorm(x, y);
    }
    
    load() {
        var self = this;
        this.canvas.addEventListener("click", function(e) {
            var canvasLeft = document.getElementById("gameBoard").offsetLeft;
            var canvasTop = document.getElementById("gameBoard").offsetTop;
            self.hitChunks(e.clientX - canvasLeft,
                e.clientY - canvasTop);
        });
    }

    fireBullet(e, xPos, yPos, archer) {
        var clientX = e.clientX - document.getElementById("gameBoard").offsetLeft;
        var clientY = e.clientY - document.getElementById("gameBoard").offsetTop;
        var distanceY = yPos - clientY;
        var distanceX = clientX - xPos;
        var bullet = new Bullet(1,distanceX/150, distanceY/120);
        bullet.loadNewBullet(xPos, yPos);
        var self = this;
        var gameBoard = document.getElementById("gameBoard");
        var bulletInterval = setInterval(function() {
            var exploded = false;
            for(var i = 0; i < bullet.chunks.length; ++i) {

                var x = bullet.chunks[i][0];
                var y = bullet.chunks[i][1];
                if(x >= gameBoard.offsetWidth || x < 0 || y >= gameBoard.offsetHeight) {
                    clearInterval(bulletInterval);
                    bullet.destroyBullet();
                    exploded = true;
                }
                if(y > 0 && y <= gameBoard.offsetHeight && !archer.hasChunk(x, y) &&
                    (self.terrain.chunks[y][x].isWormChunk || self.terrain.chunks[y][x].visible)) {
                    self.hitChunks(x, y);
                    clearInterval(bulletInterval);
                    bullet.destroyBullet();
                    exploded = true;
                }
            }
            if(!exploded) {
                bullet.changePos();
            }
        }, 1);
    }
};


var Bullet = class {
    constructor(mass, speedX, speedY) {
        this.mass = mass;
        this.speedY = speedY;
        this.speedX = speedX;
        this.wind = null;
        this.chunks = [];
        this.bulletDOM = null;
        this.xPos = null;
        this.yPos = null;
    }

    loadNewBullet(xPos, yPos) {
        this.bulletDOM = document.createElement("div");
        this.bulletDOM.setAttribute("class", "bullet");
        document.getElementById("gameBoard").appendChild(this.bulletDOM);
        this.bulletDOM.style.top = yPos + "px";
        this.bulletDOM.style.left = xPos + "px";
        this.xPos = xPos;
        this.yPos = yPos;
        this.wind = 0;
        this.loadChunks();
    }

    loadChunks() {
        this.chunks = [];
        var right = Math.round(this.xPos + this.bulletDOM.offsetWidth);
        var bottom = Math.round(this.yPos + this.bulletDOM.offsetHeight);
        for(var x = this.xPos; x < right; ++x) {
            for(var y = this.yPos; y < bottom; ++y) {
                this.chunks.push([Math.round(x), Math.round(y)]);
            }
        }

    }

    changePos() {
        this.xPos += this.speedX;
        this.yPos -= this.speedY;
        this.speedX *= 0.9999;
        this.speedY -= this.mass/100;
        this.bulletDOM.style.top = this.yPos + "px";
        this.bulletDOM.style.left = this.xPos + "px";
        this.loadChunks();
    }

    destroyBullet() {
        this.bulletDOM.parentNode.removeChild(this.bulletDOM);
        this.bulletDOM = null;
        this.chunks = [];
        this.yPos = null;
        this.xPos = null;
    }
};