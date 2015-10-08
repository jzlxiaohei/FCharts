import PainterFactory from '../Painter/PainterFactory.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'

import BaseDrawComponent from './BaseDrawComponent.js'


//TODO DefaultStyle
class CandleComponent extends BaseDrawComponent{
    constructor(options={}){
        super(options)
        //this.itemWidth
        this.upCandlePainter = PainterFactory(Constant.Painter.CANDLE)
        this.downCandlePaiter = PainterFactory(Constant.Painter.CANDLE)
    }


    draw(){
        var yAxis = this.yBridge.getYAxis(),
            xAxis = this.xBridge.getXAxis(),
            yRange = this.yBridge.getRange(),
            xRange = this.xBridge.getRange();

        var viewData = this.yBridge.getViewData()

        var itemWidth = this.xBridge.getItemWidth()

        var upY = [],downY = [],
            upX = [],downX = [];

        for(var i = 0;i<viewData.length;i++){
            var yItem = viewData[i];
            if(yItem.close < yItem.open){
                downY.push(yAxis[i])
                downX.push(xAxis[i])
            }else{
                upY.push(yAxis[i])
                upX.push(xAxis[i])
            }
        }

        this.upCandlePainter
            .setCtx(this.ctx)
            .setXAxis(upX)
            .setYAxis(upY)
            .setXRange(xRange)
            .setYRange(yRange)
            .setStyle(this.defaultStyle.Candle.up)
            .setStyle({itemWidth:itemWidth})
            .render()

        this.downCandlePaiter
            .setCtx(this.ctx)
            .setXAxis(downX)
            .setYAxis(downY)
            .setXRange(xRange)
            .setYRange(yRange)
            .setStyle(this.defaultStyle.Candle.down)
            .setStyle({itemWidth:itemWidth})
            .render();

    }

}

export default CandleComponent