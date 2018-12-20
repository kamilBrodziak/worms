var BulletsMechanism = class {

    constructor(canvas, terrain, destructionRadius, worms) {
        this.canvas = canvas;
        this.terrain = terrain;
        this.worms = worms;
        this.destructionRadius = destructionRadius;
        this.context = canvas.getContext("2d");
    } 

    hitChunks(x, y, radius, context, terrain, destroyChunk) {
        for(var xPlus = x, xMinus = x, k = radius; xPlus < radius + x; ++xPlus, --xMinus) {
            for(var yPlus = y, yMinus = y; yPlus < y + k; ++yPlus, --yMinus) {
                destroyChunk(xPlus, yMinus,  terrain, context);
                destroyChunk(xPlus, yPlus, terrain, context);
                destroyChunk(xMinus, yMinus, terrain, context);
                destroyChunk(xMinus, yPlus, terrain, context);
            }
            //move to function:
            if(xPlus >= x + radius/6 && xPlus < x + 2*radius/6 && xPlus%3 === 0) {
                --k;
            } else if(xPlus >= x + 2*radius/6 && xPlus < x + 3*radius/6 && xPlus%2 === 0) { 
                --k;
            } else if(xPlus >= x + 3*radius/6 && xPlus < x + 4*radius/6) {
                --k;
            } else if(xPlus >= x + 4*radius/6 && xPlus < x + 5*radius/6) {
                k -= 2;
            } else if(xPlus >= x + 5*radius/6) {
                k -= 3;
            }
        }
    }

    destroyChunk(x, y, terrain, context) {
        if(terrain.chunks[y][x].visible) {
            context.clearRect(x, y, 1, 1);
            terrain.chunks[y][x].visible = false;
        }
    }
    
    load() {
        var self = this;
        this.canvas.addEventListener("click", function(e) {
            var canvasLeft = document.getElementById("gameBoard").offsetLeft;
            var canvasTop = document.getElementById("gameBoard").offsetTop;
            self.hitChunks(e.clientX - canvasLeft,
                e.clientY - canvasTop, self.destructionRadius,
                self.context, self.terrain, self.destroyChunk);
        });
    }
}

