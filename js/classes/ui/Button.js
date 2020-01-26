class Button {

    constructor(x, y, width, height, stage, label, callback) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stage = stage;
        this.label = label;
        this.callback = callback;

        // FILL
        let fill = new PIXI.Graphics();
        fill.beginFill(0xFF00FF);
        fill.alpha = 0.35;
        fill.drawRect(x, y, width, height);
        this.fill = fill;
        stage.addChild(fill);

        let fontSize = Math.round(height * 0.8);
        let labelStyle = new PIXI.TextStyle({
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: fontSize,
            fill: "#99FFFF",
        });

        let glow = new PIXI.filters.BlurFilter();
        glow.blur = 8;
        this.glow = glow;

        // nice, neon glow (blur)
        this.blurText = new PIXI.Text(label, labelStyle);
        while (this.blurText.width > width * .9) labelStyle.fontSize -= 1;
        this.blurText.position.set(x + (width - this.blurText.width) / 2, y + (height - labelStyle.fontSize) / 2);
        this.blurText.filters = [glow];
        stage.addChild(this.blurText);

        // the text
        this.labelText = new PIXI.Text(label, labelStyle);
        this.labelText.position.set(x + (width - this.labelText.width) / 2, y + (height - labelStyle.fontSize) / 2);
        stage.addChild(this.labelText);

        // button outline glow
        let outlineBlur = new PIXI.Graphics();
        outlineBlur.lineStyle(1, 0x99FFFF, 1);
        outlineBlur.drawRect(x, y, width, height);
        outlineBlur.filters = [glow];
        this.outlineBlur = outlineBlur;
        stage.addChild(outlineBlur);

        // button outline
        let outline = new PIXI.Graphics();
        outline.lineStyle(2, 0x99FFFF, 1);
        outline.drawRect(x, y, width, height);
        outline.alpha = 0.5;
        this.outline = outline;
        stage.addChild(outline);

    }

    isIn(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    down(event) {
        if (this.isIn(event.clientX, event.clientY)) {
            this.fill.alpha = .7;
        } else {
            this.fill.alpha = .35;
        }

    }

    up(event) {
        this.fill.alpha = 0.35;
        if (this.isIn(event.clientX, event.clientY)) {
            this.callback();
        }
    }


}

export default Button;