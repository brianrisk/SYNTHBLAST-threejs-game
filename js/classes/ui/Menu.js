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
        let numberOfButtons = 3;
        let buttonWidth = Math.max(this.game.width / 3, 350);
        let buttonHeight = Math.min(this.game.height / 15, 70);
        let buttonSpacing = Math.min(this.game.height / 30, 30);
        let allHeight = numberOfButtons * buttonHeight + (numberOfButtons - 1) * buttonSpacing;
        let y = (this.game.height - allHeight) / 2;
        let x = (this.game.width - buttonWidth) / 2;

        let fill = new PIXI.Graphics();
        fill.beginFill(0x000000);
        fill.alpha = .8;
        fill.drawRect(x, y, buttonWidth, allHeight);
        this.fill = fill;
        this.pixiStage.addChild(fill);

        // play
        this.elements.push(
            new Button(x, y, buttonWidth, buttonHeight, this.pixiStage, "P ^ Ł * 4 ^ ¥", this.uiCallbacks.pressPlay)
        );
        y += buttonHeight + buttonSpacing;

        // upgrades
        this.elements.push(
            new Button(x, y, buttonWidth, buttonHeight, this.pixiStage, "EQU1PM3NT", function () {
            })
        );
        y += buttonHeight + buttonSpacing;


        // leaderboard
        // this.elements.push(
        //     new Button(x,y,buttonWidth,buttonHeight,this.pixiStage, "LEAD3RB04RD", function() {})
        // );
        // y += buttonHeight + buttonSpacing;


        // settings
        this.elements.push(
            new Button(x, y, buttonWidth, buttonHeight, this.pixiStage, "S3TT1NG5", function () {
            })
        );
        y += buttonHeight + buttonSpacing;

        //login
        if (typeof FB !== 'undefined') {
            this.elements.push(
                new Button(x, y, buttonWidth, buttonHeight, this.pixiStage, "RESTORE PROGRESS", FB.login)
            );
            y += buttonHeight + buttonSpacing;
        }


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

    onDocumentKeyDown(event) {

    }

    onDocumentKeyUp(event) {

    }

    mouseDown(event) {
        this.down(event);
    }

    mouseUp(event) {
        this.up(event);
    }

    down(event) {
        this.elements.forEach(element => element.down(event));
    }

    up(event) {
        this.elements.forEach(element => element.up(event));
    }

    render() {
        this.rendererPixi.render(this.pixiStage, undefined, false);
    }
}

export default Menu;