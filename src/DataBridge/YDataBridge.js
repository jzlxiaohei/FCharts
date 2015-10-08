import Utils from '../Utils/Utils.js'
import Constant from '../Constant/Constant.js'

/**
 * @class y数据桥梁
 *
 *  前提：
 *      原始数据项，分为两种，一个是数值[0,1,2]..,另一个是对象，且必须为{open,close,high,low}
 */
export class YDataBridge{
    constructor(options){
        this.axisType = options.axisType || 'default' //symmetry


        this.data  = options.data||[]
        this.range = options.range//||[0,0]

        this.viewDomain = options.viewDomain || [0,this.data.length]
        this.yAxis = new Array(this.data.length);
        this.tickCount = options.tickCount;
        this.niceTick = options.niceTick || false;

        this.linearScale = Utils.Math.LineScale();

        //this.isInit = false;
    }


    init(){
        this.buildAxis();
    }

    cloneWithOptions(extraOptions){
        var originOptions = {
            axisType:this.axisType,
            range:[this.range[0],this.range[1]]
        }
        var options = Utils.Common.merge(originOptions,extraOptions,true)
        return new YDataBridge(options)
    }

    setData(data){
        this.data=data;
        this.buildAxis();
    }


    /**
     * 计算最大最小值
     * @private
     */
    _calcMaxMin(){

        var [beginIdx,endIdx] = this.viewDomain;

        var max = -Infinity,
            min =  Infinity;
        var data = this.data;
        //数据项为数值和对象两种情况
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

        //axisType为对称时
        if(this.axisType===Constant.YAxisType.SYMMETRY){
            var absMax = Math.max(
                Math.abs(min),
                Math.abs(max)
            )
            min = -absMax,max=absMax;
        }
        this.domain = [min,max]

        this.linearScale
            .setDomain(this.domain)
            .setRange(this.range)
    }

    buildAxis(){
        this._calcMaxMin()
        const data = this.data;

        const rangeLen = this.range[1] + this.range[0]
        const ls = this.linearScale;

        const [beginIdx,endIdx] = this.viewDomain;

        this.yAxis = data.slice(beginIdx,endIdx).map( y =>{
                if(typeof y ==='object'){
                    var dataObj = {}
                    for(var i in y){
                        dataObj[i] =  rangeLen - ls.scale(y[i])
                    }
                    return dataObj
                }else{
                    return rangeLen - ls.scale(y);
                }
            }
        )

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

    getYAxis(){
        return this.yAxis;
    }

    getTicks(){
        const ticks = this.linearScale.ticks(this.tickCount,this.niceTick);
        const rangeLen = this.range[1] + this.range[0]

        let ticksWithoutOutBound = []
        for(var i = 0;i<ticks.length;i++){
            var domain = ticks[i]
            var rangeValue = rangeLen - this.linearScale.scale(domain)
            if(rangeValue > this.range[1] || rangeValue<this.range[0]){
                continue;
            }
            ticksWithoutOutBound.push({
                domainValue: domain,
                rangeValue:rangeValue
            })
        }
        return ticksWithoutOutBound
    }

    getViewData(){
        var [beginIdx,endIdx] = this.viewDomain;
        return this.data.slice(beginIdx,endIdx)
    }

    getData(){
        return this.data;
    }

    getDataByIndex(index){
        return this.data[index];
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