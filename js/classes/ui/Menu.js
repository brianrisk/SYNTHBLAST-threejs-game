import Button from "./Button.js";

class Menu {

    constructor(game, rendererPixi, sounds) {
        this.game = game;
        this.rendererPixi = rendererPixi;
        this.sounds = sounds;
        this.isMobile = 'ontouchstart' in document.documentElement;
        this.bWidth = 60;
        this.init();
    }

    init() {
        if (this.pixiStage) this.pixiStage.destroy(true);
        this.pixiStage = new PIXI.Container();
        new Button(100,100,350,50,this.pixiStage, "Facebook Login");
        if (this.isMobile) {

        } else {

        }
        new Button(100,100,350,50,this.pixiStage, "Facebook Login");
    }


    /* **************************************************************************
     *  EVENTS
     */

    touchStart(event) {
        // audio still choppy and causing low FPS!

        // if(sounds && !soundsLoaded) {
        //     for(let audio of Object.values(sounds)) {
        //         audio.play();
        //         audio.pause();
        //         audio.currentTime = 0;
        //     }
        //     soundsLoaded = true;
        // }

        this.down(event);
        event.stopImmediatePropagation();
        event.preventDefault();

    }

    touchEnd(event) {

    }

    down(event) {

    }

    onDocumentKeyDown(event) {

    }

    onDocumentKeyUp(event) {
        let keyCode = event["which"];
        if (keyCode === 32) {
            this.game.level.hero.stopShooting();
        } else if (keyCode === 37 || keyCode === 65) {
            this.game.level.hero.stopTurning();
        } else if (keyCode === 38 || keyCode === 87) {
            this.game.level.hero.stop();
        } else if (keyCode === 39 || keyCode === 68) {
            this.game.level.hero.stopTurning();
        } else if (keyCode === 40 || keyCode === 83) {
            this.game.level.hero.stop();
        }
    }

    render() {

    }
}

export default Menu;