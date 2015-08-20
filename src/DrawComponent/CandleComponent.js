import PainterFactory from '../Painter/PainterFactory.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'
import gConfig from '../GlobalConfig/GlobalConfig.js'

import BaseDrawComponent from './BaseDrawComponent.js'

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

        var itemWidth = this.xBridge.getItemWidth()

        var upY = [],downY = [],
            upX = [],downX = [];

        for(var i = 0;i<yAxis.length;i++){
            var yItem = yAxis[i];
            if(yItem.close < yItem.open){
                downY.push(yItem)
                downX.push(xAxis[i])
            }else{
                upY.push(yItem)
                upX.push(xAxis[i])
            }
        }

        this.upCandlePainter
            .setCtx(this.ctx)
            .setXAxis(upX)
            .setYAxis(upY)
            .setXRange(xRange)
            .setYRange(yRange)
            .setStyle(gConfig.Style.Candle.up)
            .setStyle({itemWidth:itemWidth})
            .render()

        this.downCandlePaiter
            .setCtx(this.ctx)
            .setXAxis(downX)
            .setYAxis(downY)
            .setXRange(xRange)
            .setYRange(yRange)
            .setStyle(gConfig.Style.Candle.down)
            .setStyle({itemWidth:itemWidth})
            .render();

    }

}

export default CandleComponent