class ProgressBar {
    constructor(x, y, width, height, stage, label) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stage = stage;
        this.label = label;
        this.percent = 0;

        // let bar = new PIXI.Graphics();
        // bar.beginFill(0xFF00FF);
        // bar.drawRect(x, y, width, height);
        // this.bar = bar;
        // stage.addChild(bar);

        let outline = new PIXI.Graphics();
        outline.lineStyle(1, 0xCCCCCC, 1);
        outline.drawRect(x, y, width, height);
        this.outline = outline;
        stage.addChild(outline);

        let labelStyle = new PIXI.TextStyle({
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 10,
            fill: "#99FFFF",
        });

        this.labelText = new PIXI.Text(label, labelStyle);
        this.labelText.position.set(x - this.labelText.width - 5, y);
        stage.addChild(this.labelText);


    }

    setProgress(percent) {
        this.stage.removeChild(this.bar);
        this.percent = percent;
        let bar = new PIXI.Graphics();
        let newWidth =  this.width * percent;
        let delta = this.width - newWidth;
        bar.beginFill(0xFF00FF);
        bar.drawRect(this.x + delta, this.y, newWidth, this.height);
        this.bar = bar;
        this.stage.addChild(bar);
    }


}

export default ProgressBar;