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