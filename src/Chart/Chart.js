import EventEmitter from 'wolfy87-eventemitter'
import invariant from 'invariant'


import PainterFactory from '../Painter/PainterFactory.js'
import YBridgeFactory from '../DataBridge/YBridgeFactory.js'
import XBridgeFactory from '../DataBridge/XBridgeFactory.js'

import BuildDrawComponentByType from './BuildDrawComponentByType.js'
import DefaultEvent from './DefaultEvent.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'
import DefaultStyle from '../DefaultStyle/DefaultStyle.js'



const getMousePos = Utils.Canvas.getMousePos;


export default class Chart extends EventEmitter{
    constructor(options){
        super();

        this.drawCanvas = options.drawCanvas;
        this.ctx = this.drawCanvas.getContext('2d')
        this.seriesOptions = options.series || [];
        this.xAxisOptions = options.xAxis;

        this.eventCanvas = options.eventCanvas;

        this.movable = options.movable || false;
        this.zoomable =  options.zoomable || false;
        this.useDefalutOnMove = options.useDefalutOnMove||false

        this.componentList = {}
        this.avgLineComponentList={}//等componentList里的组件渲染完,在渲染
        this.avgPriceComponentList={}
        this.tips = options.tips;

        this.style = options.style|| {}
        Utils.Common.merge(this.style,DefaultStyle)

        this.isInit = false;
        this._buildXAxis()
            ._buildSeries()
            ._buildEvent();
    }


    init(){
        this.xBridge.init()
        this.isInit = true;
    }


    //setCtx(ctx){
    //    this.ctx = ctx;
    //    for(var i in this.componentList){
    //        this.componentList[i].setCtx(ctx);
    //    }
    //    return this;
    //}



    /**
     *
     * @param dataObj:{x:xData,yKey1:yData1,yKey2:yData2....}
     */
    setData(dataObj){
        invariant(
            ('x' in dataObj),
            'param of chart.setData must be an Object and has property x'
        )

        for(var i in dataObj){
            if(i=='x'){
                this.xBridge.setData(dataObj.x)
            }else{
                if(i in this.componentList){
                    this.componentList[i].setData(dataObj[i])
                }else{
                    this.avgPriceComponentList[i].setData(dataObj[i])
                }
            }
        }
        for(let i in this.avgLineComponentList){
            this.avgLineComponentList[i].setData()
        }
    }

    addFirst(dataObj){
        invariant(
            ('x' in dataObj),
            'param of chart.setData must be an Object and has property x'
        )

        for(let i in dataObj){
            if(i=='x'){
                this.xBridge.addFirst(dataObj.x)
            }else{
                if(i in this.componentList){
                    this.componentList[i].addFirst(dataObj[i])
                }else{
                    this.avgPriceComponentList[i].addFirst(dataObj[i])
                }
            }
        }
        for(let i in this.avgLineComponentList){
            this.avgLineComponentList[i].addFirst()
        }
    }

    getComponent(key){
        return this.componentList[key];
    }

    drawBox(){
        const x0 = 30,y0 = 20,
            w = 470, h = this.drawCanvas.height-1;
        this.ctx.beginPath()
        this.ctx.strokeStyle='#fff'
        this.ctx.rect(x0,y0,w,h)
        this.ctx.stroke();
    }

    render(){
        if(!this.isInit){
            this.init();
        }
        this.ctx.fillStyle=  this.style.canvasColor
        this.ctx.fillRect(0,0,this.drawCanvas.width,this.drawCanvas.height)
        for(let i in this.componentList){
            this.componentList[i].render();
        }
        for(let i in this.avgPriceComponentList){
            this.avgPriceComponentList[i].render();
        }
        for(let i in this.avgLineComponentList){
            this.avgLineComponentList[i].render();
        }
        this.emit('afterRender',this);
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
            return
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


    //inner methods below
    _buildEvent(){
        if(!this.eventCanvas){
            console.warn('eventCanvas has not been set')
            return;
        }
        bindEvent.bind(this)();
    }

    _buildXAxis(){
        let xOptions = this.xAxisOptions;
        if(xOptions.fixedCount){
            this.xBridge = XBridgeFactory(Constant.XBridge.FIXED_COUNT,xOptions)
        }else{
            this.xBridge = XBridgeFactory(Constant.XBridge.ITEM_WIDTH,xOptions)
        }
        //this.xBridge.buildAxis()
        return this;
    }


    _buildSeries(){
        let sOptions = this.seriesOptions;
        for(var i in sOptions){
            var sOpt = sOptions[i]
            sOpt['chart'] = this
            this._addSeries(i,sOpt)
        }
        return this;
    }

    _addSeries(key,sOpt){
        let componentType = sOpt.type;
        sOpt.xBridge = this.xBridge;
        if(componentType === Constant.Component.AVG_LINE){
            this.avgLineComponentList[key] = BuildDrawComponentByType(componentType,sOpt);
        }else if( componentType === Constant.Component.AVG_PRICE){
            this.avgPriceComponentList[key] = BuildDrawComponentByType(componentType,sOpt)
        } else{
            this.componentList[key] = BuildDrawComponentByType(componentType,sOpt);
        }
    }

}

/**
 *
 */
function bindEvent(){
    const eventCanvas = this.eventCanvas
    if(this.movable){
        this._dragging = false;
        this._lastX;
        this._curX;

        this.on('move',DefaultEvent.onMove)

        eventCanvas.onmousedown= event => {
            this._dragging = true;
            this._lastX = getMousePos(eventCanvas,event).x;
        }
        eventCanvas.onmouseup = () =>{
            this._dragging = false;
        }
        eventCanvas.onmousemove = event=>{

            const x = getMousePos(eventCanvas,event).x,
                y = getMousePos(eventCanvas,event).y
            this.emit('move',{
                event, x, y, eventCanvas,
                __chart:this//传this不是很好，但是暂时无法确定move方法需要的东西。
            })
            this._curX = x;

            if(this._dragging){
                this.setTranslation(x- (this._lastX?this._lastX:this._curX) )
                this.render()
            }
            this._lastX = this._curX
        }
    }
    if(this.zoomable){
        eventCanvas.onwheel = (event) => {
            const x = getMousePos(eventCanvas,event).x,
                y = getMousePos(eventCanvas,event).y

            var delta = event.wheelDelta // Webkit
                || -event.deltaY
                || -event.detail; // Firefox
            var scale = delta > 0 ? 1.1 : 1 / 1.1;

            this.emit('scale',{
                event, x, y, delta, eventCanvas,
                __chart:this
            })
            this.setScale(scale, x)
            this.render()
        }
    }
}
