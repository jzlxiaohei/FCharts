import PainterFactory from '../../Painter/PainterFactory.js'
import Constant from '../../Constant/Constant.js'
import Utils from '../../Utils/Utils.js'
import DefaultStyle from '../../DefaultStyle/DefaultStyle.js'
import YBridgeFactory from '../../DataBridge/YBridgeFactory.js'

var textFormatFn = function(t){
    return ''
}

class DrawComponentBase{
    constructor(options){
        this.chart = options.chart;
        this.style = options.style || {};

        Utils.Common.merge(this.style,DefaultStyle);//非overwrite

        this.xBridge = options.xBridge
        this.yBridge = YBridgeFactory(options.bridgeType?options.bridgeType:Constant.YBridge.OHLC,{
            range:options.range,
            data:options.data,
            tickCount:options.tickCount,
            niceTick:options.niceTick
        })

        this.xTextFormat = options.xTextFormat || textFormatFn
        this.labels = options.labels || [];

        this.gridWidth = this.style.gridWidth
        this.gridColor = this.style.gridColor
        this.tickLabelColor =this.style.tickLabelColor

        this.xGridOn = options.xGridOn || false;
        this.yGridOn = options.yGridOn || false;
        this.setXGridOn(this.xGridOn);
        this.setYGridOn(this.yGridOn);
    }


    setData(data){
        this.yBridge.setData(data)
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

    //yBridge 设置可视区，非常重要！！！
    beforeDraw(){
        this.yBridge.setViewDomain(this.xBridge.getViewDomain());
        this.ctx = this.chart.ctx;
    }

    afterDraw(){
        this.drawGrid()
    }

    draw(){
        console.error('subClass of DrawComponentBase should implements draw method :'+ this.constructor.toString())
    }

    render(){
        this.beforeDraw();
        this.draw();
        this.afterDraw()
    }

    drawGrid(){


        var yRange = this.yBridge.getRange();
        var xRange = this.xBridge.getRange();

        if(this.yGridOn){
            const yTicks = this.yBridge.getTicks();
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
            const xTicks = this.xBridge.getTicks();
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
}

export default DrawComponentBase