import * as THREE from "../../lib/three/build/three.module.js";
import Game from "../../js/classes/Game.js";
import LevelUi from "../../js/classes/ui/LevelUi.js";
import Menu from "../../js/classes/ui/Menu.js";

class App {

    constructor() {
        // this.activeScreen =
    }

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
        this.activeScreen.onDocumentKeyUp(event);
    }
}

export default App;