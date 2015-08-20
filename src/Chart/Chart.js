//import Layout from '../Layout/Layout.js'
import PainterFactory from '../Painter/PainterFactory.js'
import YBridgeFactory from '../Factory/YBridgeFactory.js'
import XBridgeFactory from '../Factory/XBridgeFactory.js'

import ComponentFactory from '../DrawComponent/ComponentFactory.js'

import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

class Chart{
    constructor(options){
        this.ctx = options.ctx;
        this.canvasRect = options.canvasRect;
        this.seriesOptions = options.series || [];
        this.xAxisOptions = options.xAxis;

        //this.layout = new Layout({
        //    ctx:this.ctx
        //});

        this.eventCanvas = options.eventCanvas;
        this.movable = options.movable || false;
        this.scalable =  options.scalable || false;

        this.componentList = {}
        this.tips = options.tips;
        this.init();
    }

    setCtx(ctx){
        this.ctx = ctx;
        for(var i in this.componentList){
            this.componentList[i].setCtx(ctx);
        }
        return this;
    }

    init(){
        this._initXAxis()
            ._initSeries()
            ._initEvent();
    }

    _initEvent(){
        if(!this.eventCanvas){
            console.warn('eventCanvas not set')
        }
        if(this.movable){
            this._dragging = false;
            this._lastX;
            this._curX;
            var eventCanvas = this.eventCanvas
            eventCanvas.onmousedown= e => {
                this._dragging = true;
                this._lastX = e.x;
            }

            eventCanvas.onmouseup = e =>{
                this._dragging = false;
            }

            eventCanvas.onmousemove = e=>{
                var eventCtx = this.eventCanvas.getContext('2d');
                eventCtx.clearRect(0,0,600,600);
                eventCtx.beginPath();
                eventCtx.strokeStyle='#999999'
                eventCtx.moveTo(e.x,0)
                eventCtx.lineTo(e.x,600)
                eventCtx.fillText(this.xBridge.getIndexByValue(e.x),10,10)
                eventCtx.stroke()

                var x = getMousePos(eventCanvas,e).x
                var y = getMousePos(eventCanvas,e).y
                var info = this.getInfoByX(x);

                eventCtx.font='18px'
                //eventCtx.fillText(info.x+'   '+info['1m_line'].close_px,100,100)

                if(!info.outBound){
                    var text = this.tips(info);
                    Utils.Canvas.wrapText(eventCtx,text,x,y,200,20)
                }

                this._curX = e.x;
                if(this._dragging){
                    this.setTranslation(this._curX-this._lastX)
                    this.render()
                }
                this._lastX = this._curX
            }
        }
        if(this.scalable){
            eventCanvas.onwheel = (e) => {
                var delta = event.wheelDelta // Webkit
                    || -event.detail; // Firefox
                var scale = delta > 0 ? 1.1 : 1 / 1.1;

                this.setScale(scale, getMousePos(eventCanvas,e).x)
                this.render()
            }
        }
    }

    _initXAxis(){
        let xOptions = this.xAxisOptions;
        if(xOptions.fixedCount){
            this.xBridge = XBridgeFactory('fixedCount',xOptions)
        }else{
            this.xBridge = XBridgeFactory('itemWidth',xOptions)
        }
        this.xBridge.buildAxis()
        return this;
    }


    _initSeries(){
        let sOptions = this.seriesOptions;
        for(var i = 0;i<sOptions.length;i++){
            var sOpt = sOptions[i]
            this.addSeries(sOpt)
        }
        return this;
    }

    addSeries(sOpt){
        if(!sOpt.key){
            throw new Error('each series should has key')
        }
        if(sOpt.key in this.componentList){
            console.error('same key of series:'+sOpt.key)
        }

        let componentType = sOpt.type;

        sOpt.bridgeType = sOpt.bridgeType || Constant.YBridge.OHLC;
        let yBridge = YBridgeFactory(sOpt.bridgeType,{
            range:sOpt.range,
            data:sOpt.data,
            ohlcNameMap:sOpt.ohlcNameMap,
            tickCount:sOpt.tickCount,
            niceTick:sOpt.niceTick
        })


        var cp = ComponentFactory(componentType,{
            xBridge : this.xBridge,
            yBridge : yBridge,
            ctx:this.ctx,
            yTextFormat:sOpt.yTextFormat,
            xTextFormat:sOpt.xTextFormat,
            xGridOn:sOpt.xGridOn,
            yGridOn:sOpt.yGridOn,
            gridColor:sOpt.gridColor
        })

        this.componentList[sOpt.key] = cp;
    }

    render(){
        let [x,y,w,h] = this.canvasRect
        this.ctx.clearRect(x,y,w,h)
        for(var i in this.componentList){
            this.componentList[i].render();
        }
    }

    setScale(scale,value){
        this.xBridge.setScale(scale,value);
    }

    setTranslation(x){
        this.xBridge.setTranslation(x)
    }

    getInfoByX(xValue) {
        var index = this.xBridge.getIndexByValue(xValue);

        if(index==-1){
            return {outBound:true}
        }


        var tipInfo = {
            x: this.xBridge.getDataByIndex(index)
        }

        for (var i in this.componentList) {
            var yBridge = this.componentList[i].getYBridge()
            tipInfo[i] = yBridge.getDataByIndex(index)
        }
        return tipInfo;
    }
}

export default Chart