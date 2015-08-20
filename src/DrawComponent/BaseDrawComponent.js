import PainterFactory from '../Painter/PainterFactory.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'

var textFormatFn = function(t){
    if(t==undefined){
        return ''
    }
    return t;
}

class BaseDrawComponent{
    constructor(options){
        this.ctx = options.ctx;
        this.xBridge = options.xBridge
        this.yBridge = options.yBridge


        //TODO: set to false or remove .set default just for grid test
        this.xGridOn = options.xGridOn || false;//TODO delete:不应该由单个component管理xGrid
        this.yGridOn = options.yGridOn || false;
        //
        //this.yGridPainter = PainterFactory('yGrid')
        //this.xGridPainter = PainterFactory('xGrid');

        this.setXGridOn(this.xGridOn);
        this.setYGridOn(this.yGridOn);

        this.xTextFormat = options.xTextFormat || textFormatFn //TODO delete:不应该由单个component管理xText
        this.yTextFormat = options.yTextFormat || textFormatFn
        //this.painterInited = false;

        this.gridColor = options.gridColor
        this.gridWidth = options.gridWidth
    }

    setCtx(ctx){
        this.ctx = ctx;
        return this;
    }

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

    beforeDraw(){
        this.yBridge.setViewDomain(this.xBridge.getViewDomain());
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

        var xTextArr = []
        for(let i = 0;i<xTicks.length;i++){
            var text = this.xTextFormat(xTicks[i].domainValue)//TODO format fns
            xTextArr.push(text)
        }

        if(this.yGridOn){
            this.yGridPainter
                .setCtx(this.ctx)
                .setYAxis(yTicks)
                .setXRange(xRange)
                .setYRange(yRange)
                .setStyle({
                    strokeStyle:this.gridColor,
                    lineWidth:this.gridWidth
                })
                .setTextArray(yTicks.map(i=>this.yTextFormat(i.domainValue)))//format fns
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
                    lineWidth:this.gridWidth
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