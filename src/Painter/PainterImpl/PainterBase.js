import Utils from "../../Utils/Utils.js"

class PainterBase{
    constructor(options){
        //options = options || {};
        this.xRange = options.xRange;//这个暂时并没有什么用
        this.yRange = options.yRange;
        this.yAxis = options.yAxis || []; //
        this.xAxis = options.xAxis || [];
        this.style = options.style || {};//画图的样式
        this.ctx = options.ctx;
        //this.style.itemWidth = options.style.itemWidth;
    }

    setCtx(ctx){
        this.ctx=ctx;
        return this;
    }

    setYRange(range){
        this.yRange = range;
        return this;
    }

    setXRange(range){
        this.xRange = range;
        return this;
    }

    setStyle(style) {
        Utils.Common.merge(this.style,style,true)
        return this;
    }

    setXAxis(x){
        this.xAxis = x;
        return this;
    }
    setYAxis(y){
        this.yAxis = y;
        return this;
    }

    __beforeCheck(){
        if(this.xAxis.length < this.yAxis.length){
            console.error('xAxis.length should bigger than yAxis.length')
        }
    }


    beforeDraw(){
        //this.__beforeCheck();
        this.ctx.save();
        //var xLen = this.xRange[1] - this.xRange[0],
        //    yLen = this.yRange[1] = this.yRange[0]
        //ctx.rect(this.xRange[0],this.yRange[1],xLen,yLen);
        //ctx.clip();
        this.ctx.beginPath();
    }

    draw(){
        console.error('subClass should implements draw method')
    }

    render(){
        this.beforeDraw();
        this.draw()

        this.setDefaultStyle();
        this.afterDraw();
    }

    afterDraw(){
        var ctx = this.ctx
        var style = this.style;
        ctx.strokeStyle = style.strokeStyle || style.color;
        ctx.fillStyle = style.fillStyle || style.color;
        ctx.lineWidth = style.lineWidth || 1;
        style.brushType = style.brushType || 'stroke';
        if (style.brushType == 'both'){
            ctx.stroke();
            ctx.fill();
        }else if(style.brushType=='fill'){
            ctx.fill();
        }else{
            ctx.stroke();
        }
        ctx.restore();
    }
}

export default PainterBase