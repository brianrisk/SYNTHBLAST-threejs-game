class Button {
    constructor(x, y, width, height, stage, label) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stage = stage;
        this.label = label;

        let outline = new PIXI.Graphics();
        outline.lineStyle(1, 0xCCCCCC, 1);
        outline.beginFill(0xFF00FF);
        outline.alpha = 0.25;
        outline.drawRect(x, y, width, height);
        this.outline = outline;
        stage.addChild(outline);

        let fontSize = Math.round(height * 0.8);
        let labelStyle = new PIXI.TextStyle({
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: fontSize,
            fill: "#99FFFF",
        });

        this.labelText = new PIXI.Text(label, labelStyle);
        this.labelText.position.set(x + (width - this.labelText.width) / 2, y + (height - fontSize) / 2);
        stage.addChild(this.labelText);


    }

    down() {
        this.stage.removeChild(this.bar);
        let bar = new PIXI.Graphics();
        let newWidth =  this.width * percent;
        bar.beginFill(0xFF00FF);
        bar.drawRect(this.x, this.y, newWidth, this.height);
        this.bar = bar;
        this.stage.addChild(bar);
    }

    up() {

    }


}

export default Button;