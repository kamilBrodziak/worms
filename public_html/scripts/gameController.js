window.addEventListener("load", gameLoad);


function gameLoad() {
    const gameController = new GameController();
    const teamCount = 1;
    const wormCount = 5;
    const wormSize = 100;
    gameController.loadGame(teamCount, wormCount, wormSize);
    gameController.startGame();
}

class GameController {
    constructor() {
        this.terrain = null;
        this.canvas = null;
        this.teamControllers = [];
        this.currTeam = null;
        this.turnInterval = null;
        this.bulletsController = null;
    }

    loadGame(teamCount, wormCount) {
        this.canvas = this.drawBoard();
        this.terrain = this.createTerrain();
        this.terrain.load(this.canvas);
        var self = this;
        setTimeout(function() {
            self.createTeams(teamCount, wormCount);
            self.addBulletsMechanism();
        }, 50);
    }

    drawBoard() {
        var canvas = document.getElementById("canvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        return canvas;
    }

    createTerrain() {
        const terrain = new Terrain(0, this.canvas.getContext("2d"));
        return terrain;
    }

    createTeams(teamCount, wormCount) {
        const rangeLeft = 1;
        const wormSize = canvas.offsetWidth/25;

        const rangeRigth = canvas.offsetWidth - wormSize - 1;
        const self = this;
        for(let i = 0; i < teamCount; ++i) {
            let wormsController = new WormsController(self.terrain, self.beacon);
            wormsController.loadWorms(wormCount, wormSize, 2, rangeLeft, rangeRigth);
            self.teamControllers.push(wormsController);
        }
    }

    startGame() {
        const self = this;
        setTimeout(function() {
            self.currTeam = self.teamControllers[self.teamControllers.length - 1];
            self.runTurn();

        }, 3500);
    }

    runTurn() {
        this.nextTurn();
        const self = this;
        this.turnInterval = setInterval(function() {
            self.nextTurn();
        }, 10000);
    }

    nextTurn() {
        this.currTeam.currWorm.active = false;
        this.currTeam.currWorm.wormDOM.style.transform = "rotate(0deg)";
        this.currTeam = this.teamControllers[(this.teamControllers.indexOf(
            this.currTeam) + 1) % this.teamControllers.length];
        this.currTeam.currWorm = this.currTeam.wormList[(this.currTeam.wormList.indexOf(
            this.currTeam.currWorm) + 1) % this.currTeam.wormList.length];
        this.currTeam.currWorm.active = true;
    }


    addBulletsMechanism() {
        const destructionRadius = this.terrain.chunks[0].length/40;  
        this.bulletsController = new BulletsController(this.terrain, destructionRadius,
             this.teamControllers); 
        const self = this;
        document.getElementById("gameBoard").addEventListener("click", function(e) {
            if(self.currTeam.currWorm.active) {
                clearInterval(self.turnInterval);
                self.currTeam.currWorm.wormDOM.style.transform = "rotate(0deg)";
                const centerX = self.currTeam.currWorm.xPos + self.currTeam.currWorm.size/2;
                const centerY = self.currTeam.currWorm.yPos + self.currTeam.currWorm.size/2;
                self.currTeam.currWorm.active = false;
                self.bulletsController.fireBullet(e, centerX, centerY, self.currTeam.currWorm);
                self.turnRestartBeacon();
            }
        });
    }

    turnRestartBeacon() {
        const self = this;
        const restartTurnInterval = setInterval(function() {
            if(self.bulletsController.isTurnRestartRequired) {
                self.bulletsController.isTurnRestartRequired = false;
                clearInterval(restartTurnInterval);
                self.nextTurn();
            }
        })
    }
}