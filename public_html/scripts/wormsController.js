class WormsController {
    constructor(terrain) {
        this.wormList = [];
        this.terrain = terrain;
        this.currWorm = null;
    }

    loadWorms(count, size, team, rangeLeft, rangeRight) {
        for(let i = 0; i < count; ++i) {
            const xPos = Math.floor((Math.random() * rangeRight) + rangeLeft);
            const worm = new Worm(xPos, 100, size, team);
            this.wormList.push(worm);
            worm.load(this.terrain);
            let movement = new Movement(worm, this.terrain);
            movement.addGravity();
            movement.addMovement();
            movement.addRotation();
        }
        this.currWorm = this.wormList[this.wormList.length - 1];        
        return this.wormList;
    }

    hitWorm(xBullet, yBullet) {
        for(let i = 0; i < this.wormList.length; ++i) {
            if(this.wormList[i].hasChunk(xBullet, yBullet)) {
                if(this.takeDamage(0.01, this.wormList[i])) {
                    if(this.wormList[i] === self.currWorm) {
                        self.currWorm = this.wormList[(i - 1) % this.wormList.length];
                    }   
                    this.die(this.wormList[i]);
                    this.wormList.splice(i, 1);
                }
            }
        }
    }

    takeDamage(health, worm) {
        worm.life -= health;
        worm.healthDOM.innerHTML = Math.round(worm.life);
        let color;
        if(worm.life > 80) {
            color = "green";
        } else if (worm.life > 60) {
            color = "greenyellow";
        } else if (worm.life > 40) {
            color = "yellow";
        } else if (worm.life > 20) {
            color = "orange";
        } else {
            color = "red";
        }
        worm.healthDOM.style.backgroundImage = "linear-gradient(to right, " + color + " " +
            Math.round(worm.life) + "%, transparent " + Math.round(worm.life) + "%)"; 
        if(worm.life <= 0) {
            return true;
        }
        return false;
    }

    die(worm) {
        let chunk = null;
        for(let i = 0; i < worm.chunks.length; ++i) {
            chunk = worm.chunks[i];
            this.terrain.chunks[chunk[1]][chunk[0]].isWormChunk = false;
        }
        worm.chunks = [];
        worm.healthDOM.parentNode.removeChild(worm.healthDOM);
        worm.active = false;
        worm.wormDOM.parentNode.removeChild(worm.wormDOM);
        worm.wormDOM.setAttribute("src", "img/Worm-RIP.png");
        this.terrain.loadDiePng(worm);
        return true;
    }
}