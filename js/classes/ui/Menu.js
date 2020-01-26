import Button from "./Button.js";

class Menu {

    constructor(game, rendererPixi, sounds, uiCallbacks) {
        this.game = game;
        this.rendererPixi = rendererPixi;
        this.sounds = sounds;
        this.isMobile = 'ontouchstart' in document.documentElement;
        this.bWidth = 60;
        this.uiCallbacks = uiCallbacks;
        this.init();
    }

    init() {
        if (this.pixiStage) this.pixiStage.destroy(true);
        this.pixiStage = new PIXI.Container();
        this.elements = [];
        let buttonWidth = Math.max(window.innerWidth / 3, 350);
        let buttonHeight = Math.min(window.innerHeight / 17, 70);
        let buttonSpacing = 30;
        let allHeight  = 5 * buttonHeight + 4 * buttonSpacing;
        let y = (window.innerHeight - allHeight) / 2;
        let x = (window.innerWidth - buttonWidth) / 2;

        let fill = new PIXI.Graphics();
        fill.beginFill(0x000000);
        fill.alpha = .8;
        fill.drawRect(x, y, buttonWidth, allHeight);
        this.fill = fill;
        this.pixiStage.addChild(fill);

        // play
        this.elements.push(
            new Button(x,y,buttonWidth,buttonHeight,this.pixiStage, "P ^ Ł * 4 ^ ¥", this.uiCallbacks.pressPlay)
        );
        y += buttonHeight + buttonSpacing;

        // upgrades
        this.elements.push(
            new Button(x,y,buttonWidth,buttonHeight,this.pixiStage, "UPGRADES")
        );
        y += buttonHeight + buttonSpacing;


        // leaderboard
        this.elements.push(
            new Button(x,y,buttonWidth,buttonHeight,this.pixiStage, "LEADERBOARD")
        );
        y += buttonHeight + buttonSpacing;


        // settings
        this.elements.push(
            new Button(x,y,buttonWidth,buttonHeight,this.pixiStage, "SETTINGS")
        );
        y += buttonHeight + buttonSpacing;

        //login
        this.elements.push(
            new Button(x,y,buttonWidth,buttonHeight,this.pixiStage, "FACEBOOK LOGIN")
        );


        if (this.isMobile) {

        } else {

        }
    }


    /* **************************************************************************
     *  EVENTS
     */

    touchStart(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            this.down(touch);
        }
    }

    touchEnd(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            this.up(touch);
        }
    }

    down(event) {
        this.elements.forEach(element => element.down(event));
    }

    up(event) {
        this.elements.forEach(element => element.up(event));
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

     mouseDown(event) {
        this.down(event);
    }

     mouseUp(event) {
        this.up(event);
    }

    render() {
        this.rendererPixi.render(this.pixiStage, undefined, false);
    }
}

export default Menu;