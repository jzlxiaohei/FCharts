
import PainterBase from './PainterBase.js'

import Utils from '../Utils/Utils.js'
class XGridPainter extends PainterBase{
    constructor(options={}){
        super(options)
        this.textArr = options.textArr;
        this.yRange = options.yRange;
        this.xAxis = options.xAxis;
        this.textArr = options.textArr;
    }

    setTextArray(textArr){
        this.textArr = textArr;
        return this;
    }

    draw(){
        var ctx = this.ctx;
        var [yBegin,yEnd] = this.yRange
        var textArr = this.textArr
        var lastTickX = -Infinity;
        for(var i =0;i<this.xAxis.length;i++){
            var x = this.xAxis[i].rangeValue
            ctx.moveTo(x,yBegin)
            ctx.lineTo(x,yEnd);
            if(textArr){
                //var textWdith = Utils.Canvas.fillTextCenter(ctx,textArr[i],x,yEnd+5)
                //if(lastTickX === undefined){
                //    lastTickX = x;
                //}
                var text = textArr[i]
                var textWidth = ctx.measureText(text).width
                if(lastTickX < x - textWidth/2){
                    ctx.fillText(text,x-textWidth/2,yEnd+15)
                    lastTickX = x + textWidth/2;
                }

            }
        }
    }
}

export default XGridPainter