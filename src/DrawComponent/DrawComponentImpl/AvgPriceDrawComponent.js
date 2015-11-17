import BaseDrawComponent from './DrawComponentBase.js'

import Constant from '../../Constant/Constant.js'
import PainterFactory from '../../Painter/PainterFactory.js'

//均价线，用于分时图
export default class AvgPriceDrawComponent extends BaseDrawComponent{

    constructor(options={}){
        super(options)
        this.linePainter = PainterFactory(Constant.Painter.LINE);
        this.data = options.data;
        this.parentSeries = options.parentSeries;
    }

    setData(data){
        this.data = data;
    }

    beforeDraw(){
        //this.yBridge.setViewDomain(this.xBridge.getViewDomain());
        this.ctx = this.chart.ctx;
    }

    draw(){
        const xAxis = this.xBridge.getXAxis();


        const gap = this.xBridge.getGap(),
            itemWidth = this.xBridge.getItemWidth()


        const data = this.data;
        const [beginIdx,endIdx] = this.xBridge.getViewDomain()

        const yAxis =  this.chart.getComponent(this.parentSeries)
                .getYBridge()
                .interpolation(data.slice(beginIdx,endIdx))


        this.linePainter
            .setCtx(this.ctx)
            .setXAxis(xAxis)
            .setYAxis(yAxis)
            .setStyle(this.style.line)
            .setStyle({
                gap,
                itemWidth
            })
            .render()
    }
}