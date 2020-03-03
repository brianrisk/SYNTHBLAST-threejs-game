class ProgressBar {
    constructor(x, y, width, height, stage, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stage = stage;
        this.color = color;
        this.percent = 0;

        let bkgnd = new PIXI.Graphics();
        bkgnd.beginFill(0x000000);
        bkgnd.alpha = 1;
        bkgnd.drawRect(x, y, width, height );
        stage.addChild(bkgnd);

    }

    setProgress(percent) {
        this.stage.removeChild(this.bar);
        this.percent = percent;
        let bar = new PIXI.Graphics();
        let newWidth =  this.width * percent;
        let delta = this.width - newWidth;
        bar.beginFill(this.color);
        bar.drawRect(this.x + delta, this.y, newWidth, this.height);
        this.bar = bar;
        this.stage.addChild(bar);
    }


}

export default ProgressBar;