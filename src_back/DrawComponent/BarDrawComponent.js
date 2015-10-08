import BaseDrawComponent from './BaseDrawComponent.js'

import Constant from '../Constant/Constant.js'
import PainterFactory from '../Painter/PainterFactory.js'

function defaultSplitFn(item){
    if(item.close < item.open) return 'down'
    else return 'up'
}

class BarDrawComponent extends BaseDrawComponent{

    constructor(options={}){
        super(options)
        this.upBarPainter = PainterFactory(Constant.Painter.BAR);
        this.downBarPainter = PainterFactory(Constant.Painter.BAR);
        this.style=options.style;
        this.candleData =  options.candleData || [];
        this.upDownSplitFn = options.upDownSplitFn || defaultSplitFn;
    }

    draw(){
        var yAxis = this.yBridge.getYAxis(),
            xAxis = this.xBridge.getXAxis();

        var itemWidth = this.xBridge.getItemWidth()
        var yRange = this.yBridge.getRange();
        var xRange = this.xBridge.getRange();


        var viewDomain = this.xBridge.getViewDomain();

        var candleData = this.candleData.slice(viewDomain[0],viewDomain[1]);


        var upY = [],downY = [],
            upX = [],downX = [];

        for(var i = 0;i<candleData.length;i++){
            var yItem = candleData[i];
            if(this.upDownSplitFn(yItem) === 'down'){
                downY.push(yAxis[i])
                downX.push(xAxis[i])
            }else{
                upY.push(yAxis[i])
                upX.push(xAxis[i])
            }
        }

        this.upBarPainter
            .setCtx(this.ctx)
            .setYRange(yRange)
            .setXRange(xRange)
            .setXAxis(upX)
            .setYAxis(upY)
            .setStyle({
                color:this.defaultStyle.upColor,
                itemWidth:itemWidth
            })
            .setStyle(this.style)
            .render()

        this.downBarPainter
            .setCtx(this.ctx)
            .setYRange(yRange)
            .setXRange(xRange)
            .setXAxis(downX)
            .setYAxis(downY)
            .setStyle({
                color:this.defaultStyle.downColor,
                itemWidth:itemWidth
            })
            .setStyle(this.style)
            .render()
    }
}

export default BarDrawComponent