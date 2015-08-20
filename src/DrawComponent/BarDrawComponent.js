import BaseDrawComponent from './BaseDrawComponent.js'

import Constant from '../Constant/Constant.js'
import PainterFactory from '../Painter/PainterFactory.js'


class BarDrawComponent extends BaseDrawComponent{

    constructor(options={}){
        super(options)
        this.barPainter = PainterFactory(Constant.Painter.BAR);
        //this.painters.push(this.linePainter)
        this.style=options.style;
        this.CandleRef = options.CandleRef;
    }




    draw(){
        var yAxis = this.yBridge.getYAxis(),
            xAxis = this.xBridge.getXAxis();

        var itemWidth = this.xBridge.getItemWidth()
        var yRange = this.yBridge.getRange();

        this.barPainter
            .setCtx(this.ctx)
            .setYRange(yRange)
            .setXAxis(xAxis)
            .setYAxis(yAxis)
            .setStyle(this.style)
            .setStyle({
                itemWidth:itemWidth
            })
            .render()
    }
}

export default BarDrawComponent