class DrawComponent {

    constructor(options) {
        options = options || {}
        this.painter = options.painter;
        this.yBridge = options.yBridge;
        this.xBridge = options.xBridge;
        this.style = options.style;
    }

    setPainter(painter) {
        this.painter = painter
        return this;
    }

    setYBridge(yBridge) {
        this.yBridge = yBridge;
        return this;
    }

    getYBridge() {
        return this.yBridge;
    }

    setXBridge(xBridge) {
        this.xBridge = xBridge
        return this;
    }

    setStyle(style) {
        this.style = style;
        return this;
    }

    setData(data) {
        var bridge = this.yBridge.cloneWithOptions({
            data: data
        });
        this.yBridge = bridge;
    }

    addLast(data) {
        this.yBridge.addLast(data)
    }

    addFirst() {
        this.yBridge.addFirst(data)
    }

    render() {
        var xAxis = this.xBridge.getXAxis();

        this.yBridge.setViewRange(this.xBridge.getViewRange())
        var yAxis = this.yBridge.getYAxis(),
            style = this.style||{};


        //TODO add CandleDrawComponent to do this issue
        style.candleWidth = this.xBridge.itemWidth;


        this.painter
            .setYAxis(yAxis)
            .setXAxis(xAxis)
            .setStyle(style)
            .render();

        //TODO === ticks ===
        var ticks = this.yBridge.getTicks()
        //console.log(ticks)
        var ctx = this.painter.ctx;
        ctx.beginPath();
        for (var i = 0; i < ticks.length; i++) {
            var rangeValue = ticks[i].rangeValue;
            ctx.moveTo(0, rangeValue)
            ctx.lineTo(600, rangeValue)
            ctx.fillText(rangeValue, 550, rangeValue)
        }
        ctx.stroke();
        // === ticks end ===
    }


    setViewRange(viewRange) {
        this.yBridge.setViewRange(viewRange);
        return this;
    }

}

export default DrawComponent