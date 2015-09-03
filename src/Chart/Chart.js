//import Layout from '../Layout/Layout.js'
import PainterFactory from '../Painter/PainterFactory.js'
import YBridgeFactory from '../Factory/YBridgeFactory.js'
import XBridgeFactory from '../Factory/XBridgeFactory.js'

import ComponentFactory from '../DrawComponent/ComponentFactory.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'
import DefaultStyle from '../DefaultStyle/DefaultStyle.js'

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
        this.drawCanvas = options.drawCanvas;
        this.seriesOptions = options.series || [];
        this.xAxisOptions = options.xAxis;

        //this.canvasColor = options.canvasColor|| DefaultStyle.canvasColor;

        this.eventCanvas = options.eventCanvas;
        this.movable = options.movable || false;
        this.scalable =  options.scalable || false;

        this.componentList = {}
        this.tips = options.tips;
        this.defaultStyle = options.defaultStyle|| DefaultStyle
        this.xAxisInited = false;
        this.init();
    }

    setCtx(ctx){
        this.ctx = ctx;
        for(var i in this.componentList){
            this.componentList[i].setCtx(ctx);
        }
        return this;
    }

    initXAxis(){
        this.xAxisInited = true;
        this.xBridge.buildAxis();
    }

    init(){
        this._buildXAxis()
            ._buildSeries()
            ._buildEvent();
    }

    _buildEvent(){
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
                //console.log(e)

                var eventCtx = this.eventCanvas.getContext('2d');
                eventCtx.clearRect(0,0,eventCanvas.width,eventCanvas.height);


                var x = getMousePos(eventCanvas,e).x
                var y = getMousePos(eventCanvas,e).y
                var info = this.getInfoByX(x);

                eventCtx.beginPath();
                eventCtx.strokeStyle='#999999'
                eventCtx.moveTo(x,0)
                eventCtx.lineTo(x,eventCanvas.height)
                eventCtx.fillText(this.xBridge.getIndexByValue(x),10,10)
                eventCtx.stroke()

                eventCtx.font='18px'

                eventCtx.save()
                eventCtx.fillStyle=this.defaultStyle.tipColor;
                if(!info.outBound){
                    var text = this.tips(info);
                    Utils.Canvas.wrapText(eventCtx,text,x,y,200,20)
                }
                eventCtx.restore();

                this._curX = x;
                console.log(this._curX,this._lastX)
                if(this._dragging){
                    this.setTranslation(this._curX- (this._lastX?this._lastX:this._curX) )
                    this.render()
                }

                this._lastX = this._curX
            }
        }
        if(this.scalable){
            eventCanvas.onwheel = (event) => {
                var delta = event.wheelDelta // Webkit
                    || -event.deltaY
                    || -event.detail; // Firefox
                var scale = delta > 0 ? 1.1 : 1 / 1.1;

                this.setScale(scale, getMousePos(eventCanvas,event).x)
                this.render()
            }
        }
    }

    _buildXAxis(){
        let xOptions = this.xAxisOptions;
        if(xOptions.fixedCount){
            this.xBridge = XBridgeFactory('fixedCount',xOptions)
        }else{
            this.xBridge = XBridgeFactory('itemWidth',xOptions)
        }
        //this.xBridge.buildAxis()
        return this;
    }


    _buildSeries(){
        let sOptions = this.seriesOptions;
        for(var i in sOptions){
            var sOpt = sOptions[i]
            this.addSeries(i,sOpt)
        }
        return this;
    }

    addSeries(key,sOpt){
        let componentType = sOpt.type;
        sOpt.bridgeType = sOpt.bridgeType || Constant.YBridge.OHLC;
        let yBridge = YBridgeFactory(sOpt.bridgeType,{
            range:sOpt.range,
            data:sOpt.data,
            tickCount:sOpt.tickCount,
            niceTick:sOpt.niceTick
        })

        //console.log(sOpt)

        var cp = ComponentFactory(componentType,{
            chart:this,
            xBridge : this.xBridge,
            yBridge : yBridge,
            ctx:this.ctx,
            //yTextFormat:sOpt.yTextFormat,
            xTextFormat:sOpt.xTextFormat,
            xGridOn:sOpt.xGridOn,
            yGridOn:sOpt.yGridOn,
            gridColor:sOpt.gridColor,
            candleData:sOpt.candleData,
            style:sOpt.style,
            labels:sOpt.labels
        })

        this.componentList[key] = cp;
    }

    getComponent(key){
        return this.componentList[key];
    }

    render(){
        //let [x,y,w,h] = this.canvasRect
        //this.ctx.clearRect(0,0,600,600)
        if(!this.xAxisInited){
            this.initXAxis();
        }
        this.ctx.fillStyle= this.canvasColor || this.defaultStyle.canvasColor
        this.ctx.fillRect(0,0,this.drawCanvas.width,this.drawCanvas.height)
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