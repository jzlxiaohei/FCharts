import Utils from '../Utils/Utils.js'
//import _m  from '../Utils/OhlcNameMap.js'
import Constant from '../Constant/Constant.js'


export class YDataBridge{
    constructor(options){
        this.axisType = options.axisType || 'default' //symmetry
        this.data = options.data||[] //原始数据 一般为[{open,high,low,close} ... ]
        this.range = options.range||[0,0]
        this.viewRange = options.viewRange || [0,this.data.length]
        this.yAxis = new Array(this.data.length);
        this.isInit =  false;

        this.tickCount = options.tickCount;
        this.niceTick = options.niceTick || false;

        this.linearScale = Utils.Math.LineScale();

    }

    cloneWithOptions(extraOptions){
        var originOptions = {
            axisType:this.axisType,
            _m : this._m,
            range:[this.range[0],this.range[1]]
        }
        var options = Utils.Common.merge(originOptions,extraOptions,true)
        return new YDataBridge(options)
    }

    addFirst(arr){
        Utils.Array.unshift(this.data,arr);
        return this;
    }

    addLast(arr){
        Utils.Array.push(this.data,arr)
        return this;
    }

    _calcMaxMin(){

        var [beginIdx,endIdx] = this.viewRange;

        var max = -Infinity,
            min =  Infinity;
        var data = this.data;
        for(var i = beginIdx;i<endIdx;i++){
            var dataItem = data[i]
            var localMax = dataItem['high'] ,
                localMin = dataItem ['low']

            if(localMax > max){max = localMax;}

            if(localMin < min){min = localMin}

        }

        if(this.axisType==='symmetry'){
            var absMax = Math.max(
                Math.abs(min),
                Math.abs(max)
            )
            min = -absMax,max=absMax;
        }

        this.domain = [min,max]
        this.linearScale.setDomain(this.domain)
            .setRange(this.range)
    }

    getTicks(){
        var tickInfo = this.linearScale.ticks(this.tickCount,this.niceTick);
        var start = tickInfo.start,
            end   = tickInfo.end,
            step  = tickInfo.step;
        var ticks = []
        for(var i = start;i<=end;i+=step){
            ticks.push({
                rangeValue:i,
                domainValue:this.linearScale.invert(i)
            })
        }
        return ticks
    }

    getDomain(){
        return this.domain
    }

    getRange(){
        return this.range;
    }

    buildAxis(){
        if(!this.isInit){
            this.isInit = true;
        }

        this._calcMaxMin()
        var data = this.data;

        //console.log(this.domain)

        let tranYFn = y =>{
            let ly = this.linearScale.scale(y);

            return this.range[1] - ly + this.range[0];
        }

        var [beginIdx,endIdx] = this.viewRange;
        this.yAxis = data.slice(beginIdx,endIdx).map(item=>{
            return {
                open  : tranYFn( item[ 'open' ]),
                close : tranYFn( item[ 'close'] ),
                high  : tranYFn( item[ 'high' ] ),
                low   : tranYFn( item[ 'low'  ] )
            }
        })

        return this;
    }

    getData(origin){
        if(origin){
            return this.data;
        }else{
            var [beginIdx,endIdx] = this.viewRange;
            return this.data.slice(beginIdx,endIdx)
        }
    }

    getDataByIndex(index){
        return this.data[index];
    }

    getYAxis(){
        if(!this.isInit){
            this.buildAxis();
            this.isInit = true;
        }
        return this.yAxis;
    }

    getViewRange(){
        return this.viewRange;
    }

    setViewRange(viewRange,forceCalculate){
        if(forceCalculate===undefined){
            forceCalculate = true;
        }
        this.viewRange = viewRange;
        if(forceCalculate){
            this.buildAxis()
        }
        return this;
    }
}