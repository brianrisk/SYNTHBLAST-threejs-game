class ProgressBar {
    constructor(x, y, width, height, stage, label, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stage = stage;
        this.label = label;
        this.color = color;
        this.percent = 0;

        let labelStyle = new PIXI.TextStyle({
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 10,
            fill: "#99FFFF",
        });

        this.labelText = new PIXI.Text(label, labelStyle);

        let bkgnd = new PIXI.Graphics();
        bkgnd.beginFill(0x000000);
        let padding = 3;
        bkgnd.alpha = 1;
        bkgnd.drawRect(x - (padding + this.labelText.width + 5) , y, width + ( padding + this.labelText.width + 5), height );
        stage.addChild(bkgnd);

        // let outline = new PIXI.Graphics();
        // outline.lineStyle(1, 0xCCCCCC, 1);
        // outline.drawRect(x, y, width, height);
        // this.outline = outline;
        // stage.addChild(outline);


        this.labelText.position.set(x - this.labelText.width - 5, y);
        stage.addChild(this.labelText);


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