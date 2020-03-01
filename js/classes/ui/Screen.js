
class Screen {

    constructor(game, rendererPixi, sounds, uiCallbacks) {
        this.game = game;
        this.rendererPixi = rendererPixi;
        this.sounds = sounds;
        this.isMobile = 'ontouchstart' in document.documentElement;
        this.uiCallbacks = uiCallbacks;
    }

    /* **************************************************************************
     *  EVENTS
     */

    touchStart(event) {

    }

    touchEnd(event) {

    }

    onDocumentKeyDown(event) {

    }

    onDocumentKeyUp(event) {

    }

    mouseDown(event) {

    }

    mouseUp(event) {

    }

    render() {

    }
}

export default Screen;