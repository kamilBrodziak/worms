var BulletsMechanism = class {

    constructor(canvas, terrain, destructionRadius, worms) {
        this.canvas = canvas;
        this.terrain = terrain;
        this.worms = worms;
        this.destructionRadius = destructionRadius;
        this.context = canvas.getContext("2d");
    } 

    hitChunks(x, y, radius, context, worms, terrain, destroyChunk) {
        for(var xPlus = x, xMinus = x, k = radius; xPlus < radius + x; ++xPlus, --xMinus) {
            for(var yPlus = y, yMinus = y; yPlus < y + k; ++yPlus, --yMinus) {
                destroyChunk(xPlus, yMinus,  terrain, worms, context);
                destroyChunk(xPlus, yPlus, terrain, worms, context);
                destroyChunk(xMinus, yMinus, terrain, worms, context);
                destroyChunk(xMinus, yPlus, terrain, worms, context);
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

    destroyChunk(x, y, terrain, worms, context) {
        if(!terrain.chunks[y][x].isWormChunk) {
            context.clearRect(x, y, 1, 1);
            terrain.chunks[y][x].visible = false;
        }
    }
    
    load() {
        var hitChunks = this.hitChunks;
        var canvas = this.canvas;
        var destructionRadius = this.destructionRadius;
        var context = this.context;
        var worms = this.worms;
        var terrain = this.terrain;
        var destroyChunk = this.destroyChunk;
        this.canvas.addEventListener("click", function(e) {
            // var chunk = terrain.getChunk(e.clientX - canvas.offsetLeft,
            //                         e.clientY - canvas.offsetTop);
            hitChunks(e.clientX - canvas.offsetLeft,
                e.clientY - canvas.offsetTop, destructionRadius,
                context, worms, terrain, destroyChunk);
        });
    }
}

