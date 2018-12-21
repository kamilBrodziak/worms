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
}


var Bullet = class {
    constructor(mass, gravity, strength, angle) {
        var mass = mass;
        var gravity = gravity;
        var strength = strength;
        var angle = angle;
        var chunks = [];
        var xPos;
        var yPos;
    }
};