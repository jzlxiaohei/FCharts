
import PainterBase from './PainterBase.js'

import Utils from '../Utils/Utils.js'
class YGridPainter extends PainterBase{
    constructor(options={}){
        super(options)
        this.textArr = options.textArr;
        this.xRange = options.xRange;
        //this.xAxis = options.xAxis;

    }

    setXRange(xRange){
        this.xRange = xRange;
        return this;
    }

    setTextArray(textArr){
        this.textArr = textArr;
        return this;
    }

    draw(){
        var ctx = this.ctx;
        var textArr = this.textArr;
        var [xBegin,xEnd] = this.xRange
        //var fontHeight = 0;

        for(var i =0;i<this.yAxis.length;i++){
            var y = this.yAxis[i].rangeValue
            ctx.moveTo(xBegin,y)
            ctx.lineTo(xEnd,y);
            if(textArr){
                var text = textArr[i]
                var offset = ctx.measureText(text).width;
                ctx.fillText(text,xEnd-offset,y)
            }
        }
    }
}

export default YGridPainter