import Layout from '../Layout/Layout.js'
import PainterFactory from '../Factory/PainterFactory.js'
import YBridgeFactory from '../Factory/YBridgeFactory.js'
import XBridgeFactory from '../Factory/XBridgeFactory.js'

import Constant from '../Constant/Constant.js'

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

        this.layout = new Layout();

        this.canvasEvent = options.canvasEvent;
        this.movable = options.movable || false;
        this.scalable =  options.scalable || false;

        this.init();
    }


    init(){
        this._initXAxis()
            ._initSeries()
            ._initEvent();
    }

    _initEvent(){
        if(this.movable){
            this._dragging = false;
            this._lastX;
            this._curX;
            var canvasEvent = this.canvasEvent
            canvasEvent.onmousedown= e => {
                this._dragging = true;
                this._lastX = e.x;
            }

            canvasEvent.onmouseup = e =>{
                this._dragging = false;
            }

            canvasEvent.onmousemove = e=>{
                var eventCtx = this.canvasEvent.getContext('2d');
                eventCtx.clearRect(0,0,600,600);
                eventCtx.beginPath();
                eventCtx.strokeStyle='#000'
                eventCtx.moveTo(e.x,0)
                eventCtx.lineTo(e.x,400)
                eventCtx.fillText(this.xBridge.getIndexByValue(e.x),10,10)
                eventCtx.stroke()

                var x = getMousePos(canvasEvent,e).x
                var info = this.layout.getInfoByX(x);

                eventCtx.font='18px'
                eventCtx.fillText(info.x+'   '+info['1m_line'].close,100,100)

                this._curX = e.x;
                if(this._dragging){
                    this.setTranslation(this._curX-this._lastX)
                    this.reRender()
                }
                this._lastX = this._curX
            }
        }
        if(this.scalable){
            canvasEvent.onwheel = (e) => {
                var delta = event.wheelDelta // Webkit
                    || -event.detail; // Firefox
                var scale = delta > 0 ? 1.1 : 1 / 1.1;

                this.setScale(scale, getMousePos(canvasEvent,e).x)
                this.reRender()
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
        this.layout.setXBridge(this.xBridge)
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

        let painterType = sOpt.type;

        //var options = {
        //    range : sOpt.range,
        //    data : sOpt.data,
        //    axisType:sOpt.axisType
        //}

        if(!sOpt.bridgeType){
            sOpt.bridgeType = Constant.YBridge.OHLC;
        }
        let yBridge = YBridgeFactory(sOpt.bridgeType,sOpt)

        let painter = PainterFactory(painterType,{
            ctx:this.ctx,
            style:sOpt.style
        })
        this.layout.addComponent(sOpt.key,painter,yBridge)
    }

    render(){
        this.layout.render();
    }

    reRender(){
        let [x,y,w,h] = this.canvasRect
        this.ctx.clearRect(x,y,w,h)
        this.render()
    }

    setScale(scale,value){
        this.layout.setScale(scale,value);
    }

    setTranslation(x){
        this.layout.setTranslation(x)
    }

}

export default Chart