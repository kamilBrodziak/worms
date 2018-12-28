class BulletsController {

    constructor(terrain, destructionRadius, teamsController) {
        this.terrain = terrain;
        this.teamsController = teamsController;
        this.destructionRadius = destructionRadius;
        this.isTurnRestartRequired = false;
    } 

    hitChunks(x, y) {
        for(let xPlus = x, xMinus = x, k = this.destructionRadius;
          xPlus < this.destructionRadius + x; ++xPlus, --xMinus) {
            for(var yPlus = y, yMinus = y; yPlus < y + k; ++yPlus, --yMinus) {
                this.destroyChunk(xPlus, yMinus);
                this.destroyChunk(xPlus, yPlus);
                this.destroyChunk(xMinus, yMinus);
                this.destroyChunk(xMinus, yPlus);
            }
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

    destroyChunk(x, y) {
        if(this.terrain.chunks[y][x].visible) {
            this.terrain.context.clearRect(x, y, 1, 1);
            this.terrain.chunks[y][x].visible = false;
        }
        for(let i = 0; i < this.teamsController.length; ++i) {
            this.teamsController[i].hitWorm(x, y);
        }
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
                if(x >= gameBoard.offsetWidth || x < 0 || y >= gameBoard.offsetHeight - 10) {
                    clearInterval(bulletInterval);
                    bullet.destroyBullet();
                    exploded = true;
                    self.isTurnRestartRequired = true;
                } else if(y > 0 && y <= gameBoard.offsetHeight && !archer.hasChunk(x, y) &&
                    (self.terrain.chunks[y][x].isWormChunk || self.terrain.chunks[y][x].visible)) {
                    self.hitChunks(x, y);
                    clearInterval(bulletInterval);
                    bullet.destroyBullet();
                    exploded = true;
                    self.isTurnRestartRequired = true;
                }
            }
            if(!exploded) {
                bullet.changePos();
            }
        }, 1);
    }
};