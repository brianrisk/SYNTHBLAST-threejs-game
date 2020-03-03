import Button from "./Button.js";
import ProgressBar from "./ProgressBar.js";

class IncrementProgress {
    constructor(x, y, width, height, stage, label, callback, initialPercent, identifier) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stage = stage;
        this.label = label;
        this.callback = callback;
        this.identifier = identifier;

        let buttonHeight = height * .8;
        let progressHeight = height - buttonHeight;
        let button = new Button(x, y, width, buttonHeight, stage, label, callback);
        let progressBar = new ProgressBar(x, y + buttonHeight, width, progressHeight, stage, 0x00FFFF);
        this.button = button;
        this.progressBar = progressBar;

        /*
        calick calls callback.  callback returns progress
         */

    }

}

export default IncrementProgress;