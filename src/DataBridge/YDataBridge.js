import Utils from '../Utils/Utils.js'
//import _m  from '../Utils/OhlcNameMap.js'
import Constant from '../Constant/Constant.js'


export class YDataBridge{
    constructor(options){
        this.axisType = options.axisType || 'default' //symmetry

        //this.ohlcNameMap = options.ohlcNameMap || ohlcNameMap;

        //this.ohlcNameMapInvert = Utils.Common.invertKv(this.ohlcNameMap);
        this.data  = options.data||[] //原始数据 一般为[{open,high,low,close} ... ]
        this.range = options.range||[0,0]

        this.viewDomain = options.viewDomain || [0,this.data.length]
        this.yAxis = new Array(this.data.length);
        this.tickCount = options.tickCount;
        this.niceTick = options.niceTick || false;

        this.linearScale = Utils.Math.LineScale();

        this.isInit =  false;
    }

    //_m(k){
    //    var ohlcNameMap = this.ohlcNameMap
    //    if(k in ohlcNameMap){
    //        return ohlcNameMap[k]
    //    }
    //    return k;
    //}
    //
    //_mi(k){
    //    var ohlcNameMapInvert = this.ohlcNameMapInvert
    //    if(k in ohlcNameMapInvert){
    //        return ohlcNameMapInvert[k]
    //    }
    //    return k;
    //}

    cloneWithOptions(extraOptions){
        var originOptions = {
            axisType:this.axisType,
            //_m : this._m,
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


        var [beginIdx,endIdx] = this.viewDomain;

        var max = -Infinity,
            min =  Infinity;
        var data = this.data;
        if(typeof data[0] === 'object'){
            for(var i = beginIdx;i<endIdx;i++){
                var dataItem = data[i]
                var localMax = dataItem['high'] ,
                    localMin = dataItem ['low']
                if(localMax > max){max = localMax;}
                if(localMin < min){min = localMin}
            }
        }else{
            for(var i = beginIdx;i<endIdx;i++){
                var dataValue = data[i]
                if(dataValue > max){max = dataValue;}
                if(dataValue < min){min = dataValue}
            }
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

    buildAxis(){
        if(!this.isInit){
            this.isInit = true;
        }

        this._calcMaxMin()
        var data = this.data;

        //console.log(this.domain)
        var rangeLen = this.range[1] + this.range[0]
        var ls = this.linearScale;

        let tranYFn = y =>{
            if(typeof y ==='object'){
                var dataObj = {}
                for(var i in y){
                    //var _i = this._mi(i);
                    dataObj[i] = rangeLen - ls.scale(y[i])
                }
                return dataObj
            }else{
                return rangeLen - ls.scale(y);
            }
        }

        var [beginIdx,endIdx] = this.viewDomain;
        this.yAxis = data.slice(beginIdx,endIdx).map(item=>{
            return tranYFn(item)
        })

        return this;
    }

    setViewDomain(viewDomain,forceCalculate){
        if(forceCalculate===undefined){
            forceCalculate = true;
        }
        this.viewDomain = viewDomain;
        if(forceCalculate){
            this.buildAxis()
        }
        return this;
    }

    getTicks(){
        //var lineScale =  Utils.Math.LineScale(this.domain)
        var ticks = this.linearScale.ticks(this.tickCount,this.niceTick);
        var rangeLen = this.range[1] + this.range[0]

        var newTicks = []
        for(var i = 0;i<ticks.length;i++){
            var domain = ticks[i]
            var rangeValue = rangeLen - this.linearScale.scale(domain)
            if(rangeValue > this.range[1] || rangeValue<this.range[0]){
                continue;
            }
            newTicks.push({
                //rangeValue:i,
                //domainValue:this.linearScale.invert(i)
                domainValue: domain,
                rangeValue:rangeValue
            })
        }
        return newTicks
    }

    getViewData(){
        var [beginIdx,endIdx] = this.viewDomain;
        return this.data.slice(beginIdx,endIdx)
    }

    getData(){
        //if(origin){
        //    return this.data;
        //}else{
        //    var [beginIdx,endIdx] = this.viewDomain;
        //    return this.data.slice(beginIdx,endIdx)
        //}
        return this.data;
    }

    getDataByIndex(index){
        return this.data[index];
    }

    getYAxis(){
        if(!this.isInit){
            this.buildAxis();
        }
        return this.yAxis;
    }

    getViewDomain(){
        return this.viewDomain;
    }

    getDomain(){
        return this.domain
    }

    getRange(){
        return this.range;
    }
}