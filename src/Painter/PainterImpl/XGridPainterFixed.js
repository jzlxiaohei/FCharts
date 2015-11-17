
import PainterBase from './PainterBase.js'

import Utils from '../../Utils/Utils.js'

class XGridPainter extends PainterBase{
    constructor(options={}){
        super(options)
        this.tickList = options.tickList;
    }

    setTickList(tickList){
        this.tickList = tickList;
        return this;
    }

    draw(){
        var ctx = this.ctx;
        ctx.save()
        ctx.fillStyle = this.style.tickLabelColor;
        const y0 = this.tickList.y0,
            y1 = this.tickList.y1,
            tickData = this.tickList.data;
        for(var i =0;i<tickData.length;i++){
            const tickObj = tickData[i]
            let x = tickObj.x,
                {text,textAlign,yOffset} = tickObj.text;
            textAlign = textAlign || 'middle'

            if(yOffset===undefined){yOffset=15}
            ctx.moveTo(x,y0)
            ctx.lineTo(x,y1)
            let xOffset=0;
            if(textAlign=='right'){
                let textWidth = ctx.measureText(text).width
                xOffset = -textWidth
            }
            if(textAlign=='middle'){
                let textWidth = ctx.measureText(text).width
                xOffset = -textWidth/2;
            }
            ctx.fillText(text,x+xOffset,y1+15)
        }
        ctx.restore();
    }
}

export default XGridPainter