import Utils from "../Utils/Utils.js"

class PainterBase{
    constructor(opt){
        opt = opt || {};
        this.yArr = opt.yArr || []; //
        this.xArr = opt.xArr || [];
        this.style = opt.style || {};
        this.ctx = opt.ctx;
    }

    setStyle(style) {
        Utils.Common.merge(this.style,style,true)
        return this;
    }

    setXAxis(x){
        this.xArr = x;
        return this;
    }
    setYAxis(y){
        this.yArr = y;
        return this;
    }

    beforeDraw(){
        this.ctx.beginPath();
    }

    draw(){
        console.error('subClass should implements draw method')
    }

    render(){
        this.beforeDraw();
        this.draw()
        this.afterDraw();
    }

    afterDraw(){
        var ctx = this.ctx
        var style = this.style;
        ctx.strokeStyle = style.strokeStyle;
        ctx.fillStyle = style.fillStyle;

        style.brushType = style.brushType || 'stroke';
        if (style.brushType == 'both'){
            ctx.stroke();
            ctx.fill();
        }else if(style.brushType=='fill'){
            ctx.fill();
        }else{
            ctx.stroke();
        }
    }
}

export default PainterBase