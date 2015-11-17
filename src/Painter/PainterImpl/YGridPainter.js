
import PainterBase from './PainterBase.js'

import Utils from '../../Utils/Utils.js'

/**
 * labels:[
 *  textAlign:
 *  yText:
 *  yList
 *  top:
 *  pos:
 *  place:
 * ]
 *
 *
 *
 */

class YGridPainter extends PainterBase{
    constructor(options={}){
        super(options)
        //this.textArr = options.textArr;
        this.xRange = options.xRange;
        //this.xAxis = options.xAxis;
        this.labels = options.labels

    }

    setLabels(labels){
        this.labels = labels;
        return this;
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
        //var textArr = this.textArr;
        var [xBegin,xEnd] = this.xRange
        //var fontHeight = 0;
        ctx.save();
        ctx.beginPath()
        for(var i =0;i<this.yAxis.length;i++){
            var y = this.yAxis[i].rangeValue
            ctx.moveTo(xBegin,y)
            ctx.lineTo(xEnd,y);
        }
        this.drawText()
        ctx.restore();
    }

    drawText(){
        var ctx =this.ctx;
        var yList = this.yAxis.map(item=>item.rangeValue);
        var yText = this.yAxis.map(item=>item.domainValue);
        ctx.save()
        ctx.fillStyle = this.style.tickLabelColor;
        for(var i = 0;i<this.labels.length;i++){
            this._drawSingle(yList,yText,this.labels[i])
        }
        ctx.restore()
    }

    //画每个label
    _drawSingle(yList,yText,opt){
        var [xBegin,xEnd] = this.xRange;
        let base,textAlign;
        var top = opt.top || 0;
        if(opt.pos=='left'){
            if(opt.place=='inner'){
                textAlign='start'
            }
            if(opt.place=='outer'){
                textAlign='end'
            }
            base = opt.base || xBegin
        }
        if(opt.pos=='right'){
            if(opt.place=='inner'){
                textAlign='end'
            }
            if(opt.place=='outer'){
                textAlign='start'
            }
            base = opt.base || xEnd
        }
        var valueFn = opt.value || Utils.Fn.identify
        var styleFn = opt.style;
        var ctx = this.ctx;
        ctx.textAlign=textAlign;
        for(let i =0;i<yList.length;i++){
            var y = yList[i]
            //ctx.beginPath()
            if(!styleFn){
                ctx.fillStyle = this.style.tickLabelColor;
            }else{
                const style = styleFn(yText[i],yList[i]);
                for(let p in style){
                    ctx[p] = style[p]
                }
            }

            ctx.fillText(valueFn(yText[i]),base,y-top)
        }
    }
}

export default YGridPainter