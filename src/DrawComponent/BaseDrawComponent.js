import PainterFactory from '../Painter/PainterFactory.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'
import DefaultStyle from '../DefaultStyle/DefaultStyle.js'


var textFormatFn = function(t){
    return ''
}

class BaseDrawComponent{
    constructor(options){
        //this.ctx = options.ctx;
        //this.type = 'base'
        this.chart = options.chart;
        this.defaultStyle=this.chart.defaultStyle;

        this.xBridge = options.xBridge
        this.yBridge = options.yBridge


        this.xGridOn = options.xGridOn || false;
        this.yGridOn = options.yGridOn || false;

        this.setXGridOn(this.xGridOn);
        this.setYGridOn(this.yGridOn);

        this.xTextFormat = options.xTextFormat || textFormatFn
        //this.yTextFormat = options.yTextFormat || textFormatFn
        //this.painterInited = false;

        this.gridColor = options.gridColor || DefaultStyle.gridColor
        this.gridWidth = options.gridWidth || 1
        this.tickLabelColor = options.tickLabelColor || DefaultStyle.tickLabelColor
        this.labels = options.labels || [];
        this.style = options.style||{}
    }

    //setCtx(ctx){
    //    this.ctx = ctx;
    //    return this;
    //}

    setYBridge(yBridge){
        this.yBridge = yBridge
        return this;
    }
    setXBridge(xBridge){
        this.xBridge = xBridge;
        return this;
    }

    setXGridOn(xGridOn){
        this.xGridOn = xGridOn;
        if(this.xGridOn && !this.xGridPainter){
            this.xGridPainter = PainterFactory(Constant.Painter.X_GRID);
        }
        return this;
    }

    setYGridOn(yGridOn){
        this.yGridOn = yGridOn;
        if(this.yGridOn && !this.yGridPainter){
            this.yGridPainter = PainterFactory(Constant.Painter.Y_GRID)
        }
        return this;
    }

    //yBridge 设置可视区，非常重要！！！
    beforeDraw(){
        this.yBridge.setViewDomain(this.xBridge.getViewDomain());
        this.ctx = this.chart.ctx;
    }

    afterDraw(){
        this.drawGrid()
    }

    draw(){
        console.error('subClass of BaseDrawComponent should implements draw method :'+ this.constructor.toString())
    }

    render(){
        this.beforeDraw();
        this.draw();
        this.afterDraw()
    }

    drawGrid(){
        //TODO check xGridOn and yGridOn

        var xTicks = this.xBridge.getTicks();
        var yTicks = this.yBridge.getTicks();
        var yRange = this.yBridge.getRange();
        var xRange = this.xBridge.getRange();

        //var xTextArr = []
        //for(let i = 0;i<xTicks.length;i++){
        //    var text = this.xTextFormat(xTicks[i].domainValue)//TODO format fns
        //    xTextArr.push(text)
        //}

        if(this.yGridOn){
            this.yGridPainter
                .setCtx(this.ctx)
                .setYAxis(yTicks)
                .setXRange(xRange)
                .setYRange(yRange)
                .setStyle({
                    strokeStyle:this.gridColor,
                    lineWidth:this.gridWidth,
                    tickLabelColor:this.tickLabelColor
                })
                //.setTextArray(yTicks.map(i=>this.yTextFormat(i.domainValue)))//format fns
                .setLabels(this.labels)
                .render()
        }

        if(this.xGridOn){
            this.xGridPainter
                .setCtx(this.ctx)
                .setXAxis(xTicks)
                .setXRange(xRange)
                .setYRange(yRange)
                .setStyle({
                    strokeStyle:this.gridColor,
                    lineWidth:this.gridWidth,
                    tickLabelColor:this.tickLabelColor
                })
                .setTextArray(xTicks.map(i=> this.xTextFormat(i.domainValue)))
                .render()
        }

    }

    getYBridge() {
        return this.yBridge;
    }

    setStyle(style) {
        this.style = style;
        return this;
    }

    //setViewDomain(viewDomain) {
    //    this.yBridge.setViewDomain(viewDomain);
    //    return this;
    //}


}

export default BaseDrawComponent