import Level from "./Level.js";
class Game {
    constructor(rendererThree, sounds) {
        this.rendererThree = rendererThree;
        this.sounds = sounds;
        this.levelNumber = 1;
        this.levelChangeTime = (new Date()).getTime();
        this.level = new Level(this, this.rendererThree, this.sounds);
        this.score = 0;
    }

    render(fpsAdjustment) {
        if (this.level.hasWon()) {
            this.levelNumber++;
            this.levelChangeTime = (new Date()).getTime();
            this.level = new Level(this, this.rendererThree, this.sounds);
        }
        this.level.render(fpsAdjustment);
    }
}

export default Game;