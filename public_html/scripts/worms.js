var Worm = class {
    constructor(x, y, life, team) {
        this.x = x;
        this.y = y;
        this.life = life;
        this.team = team;
        this.speedX = 0;
        this.speedY = 0;    
        this.gravity = 0.05;
        this.gravitySpeed = 0;
    }

    load(context, terrain) {
        var img = new Image();
        img.src = "images/worm" + this.team + ".png";
        img.onload = function() {
            context.drawImage(img, this.x, this.y, 80, 80);
            
        };
    };

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
}