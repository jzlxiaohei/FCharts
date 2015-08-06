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
        //console.log(style)
        //if(xAxis.length != yAxis.length){
        //    console.error('x count not equal y count')
        //}

        this.painter
            .setYAxis(yAxis)
            .setXAxis(xAxis)
            .setStyle(style)
            .render();

        //TODO ticks
        var ticks = this.yBridge.getTicks()

        //console.log(ticks)
        var ctx = this.painter.ctx;
        ctx.beginPath();
        for (var i = 0; i < ticks.length; i++) {
            //var rangeValue = this.yBridge.range[1] - ticks[i].rangeValue
            var rangeValue = ticks[i].rangeValue;
            ctx.moveTo(0, rangeValue)
            ctx.lineTo(600, rangeValue)
            ctx.fillText(rangeValue, 550, rangeValue)
        }
        ctx.stroke();
        //var {start,end,step} = this.yBridge.linearScale.ticks(3);
        //var ticks = [],ticksValue=[]
        //for(var i = start;i<=end;i+=step){
        //    ticksValue.push(i)
        //    ticks.push(this.yBridge.range[1]-this.yBridge.linearScale.scale(i));
        //}
        //var ctx =  this.painter.ctx;
        //ctx.beginPath();
        //
        //for(var i = 0;i<ticks.length;i++){
        //    ctx.moveTo(0,ticks[i])
        //    ctx.lineTo(600,ticks[i])
        //}
        //ctx.stroke();
        //console.log(ticks)
        //console.log(ticksValue)

    }


    setViewRange(viewRange) {
        this.yBridge.setViewRange(viewRange);
        return this;
    }

}

export default DrawComponent