class UI {

    constructor(game, rendererPixi, sounds) {
        this.game = game;
        this.rendererPixi = rendererPixi;
        this.sounds = sounds;
        this.isMobile = 'ontouchstart' in document.documentElement;
        this.bWidth = 60;
        this.init();
    }

    init() {
        this.pixiStage = new PIXI.Container();
        if (this.isMobile) {
            let half = this.bWidth / 2;
            let offset = 10;
            let x0 = offset;
            let x1 = this.bWidth + offset;
            let x2 = this.bWidth * 2 + offset;
            let x3 = this.bWidth * 3 + offset;
            let y1 = window.innerHeight - this.bWidth * 3 - offset;
            let y2 = window.innerHeight - this.bWidth * 2 - offset;
            let y3 = window.innerHeight - this.bWidth - offset;
            let y4 = window.innerHeight - offset;

            // squares
            this.b1 = this.getSquare(x0, y1, this.bWidth);
            this.pixiStage.addChild(this.b1);
            this.b2 = this.getSquare(x1, y1, this.bWidth);
            this.pixiStage.addChild(this.b2);
            this.b3 = this.getSquare(x2, y1, this.bWidth);
            this.pixiStage.addChild(this.b3);

            this.b4 = this.getSquare(x0, y2, this.bWidth);
            this.pixiStage.addChild(this.b4);
            this.b6 = this.getSquare(x2, y2, this.bWidth);
            this.pixiStage.addChild(this.b6);

            this.b7 = this.getSquare(x0, y3, this.bWidth);
            this.pixiStage.addChild(this.b7);
            this.b8 = this.getSquare(x1, y3, this.bWidth);
            this.pixiStage.addChild(this.b8);
            this.b9 = this.getSquare(x2, y3, this.bWidth);
            this.pixiStage.addChild(this.b9);

            this.bFire = new PIXI.Graphics();
            this.bFire.beginFill(0xFF00FF);
            this.bFire.drawEllipse(
                window.innerWidth - (this.bWidth * 1.5),
                window.innerHeight - (this.bWidth * 1.5),
                this.bWidth,
                this.bWidth);
            this.bFire.alpha = 0.6;
            this.bFire.visible = false; // initially hidden
            this.pixiStage.addChild(this.bFire);

            let fireOutline = new PIXI.Graphics();
            fireOutline.lineStyle(2, 0xCC88CC, 1);
            fireOutline.drawEllipse(
                window.innerWidth - (this.bWidth * 1.5),
                window.innerHeight - (this.bWidth * 1.5),
                this.bWidth,
                this.bWidth);
            this.pixiStage.addChild(fireOutline);

            // grid
            let gridThickness = 2;
            this.drawLine(x0, y1, x3, y1, gridThickness);
            this.drawLine(x0, y2, x3, y2, gridThickness);
            this.drawLine(x0, y3, x3, y3, gridThickness);
            this.drawLine(x0, y4, x3, y4, gridThickness);
            this.drawLine(x0, y1, x0, y4, gridThickness);
            this.drawLine(x1, y1, x1, y4, gridThickness);
            this.drawLine(x2, y1, x2, y4, gridThickness);
            this.drawLine(x3, y1, x3, y4, gridThickness);
            //arrows
            this.drawArrow(x0 + half, y1 + half, Math.PI * -.25);
            this.drawArrow(x1 + half, y1 + half, 0);
            this.drawArrow(x2 + half, y1 + half, Math.PI * .25);
            this.drawArrow(x0 + half, y2 + half, Math.PI * -.5);
            this.drawArrow(x2 + half, y2 + half, Math.PI * .5);
            this.drawArrow(x0 + half, y3 + half, Math.PI * -.75);
            this.drawArrow(x1 + half, y3 + half, Math.PI * -1);
            this.drawArrow(x2 + half, y3 + half, Math.PI * -1.25);
        } else {
            // https://stackoverflow.com/questions/55692097/stop-pixel-font-from-being-blurred-when-rendered
            let instructionStyle = new PIXI.TextStyle({
                fontFamily: "\"Courier New\", Courier, monospace",
                fontSize: 14,
                fill: "#00FFFF",
                stroke: '#ff00FF',
                strokeThickness: 1,
                dropShadow: true,
                dropShadowColor: "#000000",
                dropShadowBlur: 2,
                dropShadowAngle: 0,
                dropShadowDistance: 0,
            });

            this.instructionText = new PIXI.Text('ARROW KEYS TO MOVE; SPACE TO FIRE.', instructionStyle);
            this.instructionText.position.set(10, window.innerHeight - 50);
            this.pixiStage.addChild(this.instructionText);
        }

        let statusStyle = new PIXI.TextStyle({
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 18,
            fill: "#99DDDD",
        });

        this.statusText = new PIXI.Text("", statusStyle);
        this.statusText.position.set(10, 50);
        this.pixiStage.addChild(this.statusText);

        let finalSize = Math.max(window.innerWidth / 20, window.innerHeight / 8);
        let finalStyle = new PIXI.TextStyle({
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: finalSize,
            fill: "#99FFFF",
            align: "center",
            dropShadow: true,
            dropShadowBlur: 10,
            dropShadowDistance: 0,
            dropShadowAlpha: 0.5
        });

        this.finalText = new PIXI.Text("", finalStyle);
        this.finalText.position.set(window.innerWidth / 2, (window.innerHeight - finalSize) / 2);
        this.pixiStage.addChild(this.finalText);
    }

    getSquare(x, y, width) {
        let square = new PIXI.Graphics();
        square.beginFill(0xFF00FF);
        square.drawRect(x, y, width, width);
        square.alpha = 0.6;
        square.visible = false; // initially hidden
        return square;
    }

    drawLine(x1, y1, x2, y2, thickness) {
        this.pixiStage.addChild(this.getLine(x1, y1, x2, y2, thickness));
    }

    getLine(x1, y1, x2, y2, thickness) {
        let line = new PIXI.Graphics();
        line.lineStyle(thickness, 0xCC88CC, 1);
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        return line;
    }

    drawArrow(x, y, rotation) {
        const container = new PIXI.Container();
        let l = 10;
        let thickness = 2;
        container.addChild(this.getLine(0, 5, 0, 0 - l, thickness));
        container.addChild(this.getLine(0, 0 - l, 0 - l, 0, thickness));
        container.addChild(this.getLine(0, 0 - l, l, 0, thickness));
        container.x = x;
        container.y = y;
        container.rotation = rotation;
        this.pixiStage.addChild(container);
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
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            if (touch.clientX < window.innerWidth / 2) {
                this.game.level.hero.stopTurning();
                this.game.level.hero.stop();
                this.b1.visible = false;
                this.b2.visible = false;
                this.b3.visible = false;
                this.b4.visible = false;
                this.b6.visible = false;
                this.b7.visible = false;
                this.b8.visible = false;
                this.b9.visible = false;
            } else {
                this.bFire.visible = false;
                this.game.level.hero.stopShooting();
            }
        }
    }

    down(event) {
        // making us pause a second at the beginning of a level
        if (((new Date()).getTime() - this.game.levelChangeTime) < 1000) return;
        if (!this.game.level.hasStarted) {
            this.sounds.launch.currentTime = 0;
            this.sounds.launch.volume = 0.5;
            this.sounds.launch.play();
        }
        this.game.level.hasStarted = true;
        // only be responsive when "inPlay"
        if (!this.game.level.inPlay) return;
        for (let i = 0; i < event.touches.length; i++) {
            let touch = event.touches[i];
            let x = touch.clientX;
            let y = touch.clientY;
            let offset = 10;
            let x0 = 0;
            let x1 = this.bWidth + offset;
            let x2 = this.bWidth * 2 + offset;
            let x3 = this.bWidth * 4 + offset;
            let y1 = window.innerHeight - this.bWidth * 4 - offset;
            let y2 = window.innerHeight - this.bWidth * 2 - offset;
            let y3 = window.innerHeight - this.bWidth - offset;
            let y4 = window.innerHeight;

            if (x < x3 && y > y1) {
                this.b1.visible = false;
                this.b2.visible = false;
                this.b3.visible = false;
                this.b4.visible = false;
                this.b6.visible = false;
                this.b7.visible = false;
                this.b8.visible = false;
                this.b9.visible = false;

                if (x > x0 && x < x1 && y > y1 && y < y2) this.b1.visible = true;
                if (x > x1 && x < x2 && y > y1 && y < y2) this.b2.visible = true;
                if (x > x2 && x < x3 && y > y1 && y < y2) this.b3.visible = true;

                if (x > x0 && x < x1 && y > y2 && y < y3) this.b4.visible = true;
                if (x > x2 && x < x3 && y > y2 && y < y3) this.b6.visible = true;

                if (x > x0 && x < x1 && y > y3 && y < y4) this.b7.visible = true;
                if (x > x1 && x < x2 && y > y3 && y < y4) this.b8.visible = true;
                if (x > x2 && x < x3 && y > y3 && y < y4) this.b9.visible = true;
            }

            // check that we're in the control box
            if (x < x3 && y > y1) {
                if (x < x1) {
                    this.game.level.hero.turnLeft();
                }
                if (x > x1 && x < x2) {
                    this.game.level.hero.stopTurning();
                }
                if (x > x2) {
                    this.game.level.hero.turnRight();
                }
                if (y < y2) {
                    this.game.level.hero.forward();
                }
                if (y > y2 && y < y3) {
                    this.game.level.hero.stop();
                }
                if (y > y3) {
                    this.game.level.hero.reverse();
                }
            }

            if (x > window.innerWidth - 3 * this.bWidth) {
                this.game.level.hero.startShooting();
                this.bFire.visible = true;
            }
        }
    }

    onDocumentKeyDown(event) {
        // making us pause a second at the beginning of a level
        if (((new Date()).getTime() - this.game.levelChangeTime) < 1000) return;
        if (!this.game.level.hasStarted) {
            this.sounds.launch.currentTime = 0;
            this.sounds.launch.volume = 0.5;
            this.sounds.launch.play();
        }
        this.game.level.hasStarted = true;
        let keyCode = event["which"];
        if (this.game.level.inPlay) {
            if (event.shiftKey) {
                this.game.level.hero.changePerspective();
            } else if (keyCode === 32) {
                this.game.level.hero.startShooting();
            } else if (keyCode === 37 || keyCode === 65) {
                this.game.level.hero.turnLeft();
            } else if (keyCode === 38 || keyCode === 87) {
                this.game.level.hero.forward();
            } else if (keyCode === 39 || keyCode === 68) {
                this.game.level.hero.turnRight();
            } else if (keyCode === 40 || keyCode === 83) {
                this.game.level.hero.reverse();
            }
        }
        this.pixiStage.removeChild(this.instructionText);
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
        if (this.game.level.padsRemaining === 0) {

        } else if (this.game.level.hero.hitPoints <= 0) {
            this.finalText.text = "TRY AGAIN";
            this.finalText.x = (window.innerWidth - this.finalText.width) / 2;
            this.statusText.text = "";
        } else {
            if (this.game.level.hasStarted) {
                this.finalText.text = "";
            } else {
                if (this.game.level.isZombie) {
                    this.finalText.text = "ZOMBIE MODE";
                } else {
                    this.finalText.text = "LEVEL " + this.game.levelNumber;
                }

                this.finalText.x = (window.innerWidth - this.finalText.width) / 2;
            }
            this.statusText.text =
                "LEVEL: " + this.game.levelNumber + "\n" +
                "PADS: " + this.game.level.padsRemaining + "\n" +
                "HEALTH: " + this.game.level.hero.hitPoints + "\n" +
                "SHIELD: " + this.game.level.hero.shieldHitPoints + "\n" +
                "POINTS: " + this.game.score + "\n";
        }
        this.rendererPixi.render(this.pixiStage, undefined, false);
    }
}

export default UI;