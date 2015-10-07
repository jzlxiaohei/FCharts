import BaseDrawComponent from './DrawComponentBase.js'

import Constant from '../../Constant/Constant.js'
import PainterFactory from '../../Painter/PainterFactory.js'

//TODO defaultStyle

class LineDrawComponent extends BaseDrawComponent{

    constructor(options={}){
        super(options)
        this.pickedProp = options.pickedProp || 'close'
        this.linePainter = PainterFactory(Constant.Painter.LINE);
        //this.painters.push(this.linePainter)
        //this.style=options.style.line;
    }

    draw(){
        var yAxis = this.yBridge.getYAxis(),
            xAxis = this.xBridge.getXAxis();

        var y0 = yAxis[0]
        if(typeof y0 =='object'){
            yAxis = yAxis.map(item=>item[this.pickedProp])
        }

        this.linePainter
            .setCtx(this.ctx)
            .setXAxis(xAxis)
            .setYAxis(yAxis)
            .setStyle(this.style.line)
            .render()
    }
}

export default LineDrawComponent