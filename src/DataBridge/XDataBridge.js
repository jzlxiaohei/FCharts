/**
 * @author: zilong (jzlxiaohei@163.com)
 * */

import Utils from '../Utils/Utils.js'



/**
 * @class
 * @BaseClass ：
 *
 * 前提：
 *      data是时间序列的数据，且顺序已经排好。当n>m时，data[n]>data[m]
 *
 * 默认得到的x轴坐标，只有`可视区`内的。
 *
 * */

/**
 * options 各参数说明：
 *
 * data:required. x轴对应的原始数据，每个数据项为时间。
 *
 * range: required. x轴的范围。
 *
 * beginDate,endDate
 *      使用者可以指定日期的开始时间和结束时间;不指定，就默认为beginDate为data的第一项，endDate为data的第二项
 *      指定主要是为了时间序列的生成。比如分时图，开始的时候可能只有1个数据点，但是时间序列的范围（A股为例）应该是9点半到3点
 *
 * gap:每个数据项在作图时，之间的间隔。默认为0
 * itemWidth: 每个数据项，在canvas上的所占的宽度。
 *          分为 1.用户指定 2.用户给定要展示的数据项个数，然后自动算出。
 *          两个子类分别实现了这两个算法。
 *         （range的范围 和gap itemWidth有数学上的计算关系）
 *
 * direction:当数据点多过range范围可以展示的数据点时，用于指定数据的起始方向。模式为`end`,则为右对齐,既最右边先画出最大的data项
 *
 *
 * */
class XDataBridgeBase{
    constructor(options){
        this._options = options;
        this.data = options.data || [];
        this.range = options.range //|| [0,0]
        this.gap = options.gap ||0;
        this.beginDate = options.beginDate;
        this.endDate = options.endDate;
        this.direction = options.direction || 'end'
        this.scaleRange = options.scaleRange || [0.01,5]



        //缩放倍数
        this.scale = 1;

        //x轴的坐标是不是已经初始化。初始化后，有些设置是不需要的，比如`direction`的设置不能在生效。
        //this.isInit = false;

        //坐标轴上的tick数量。时间序列，暂时都是niceTick
        this.tickCount = options.tickCount || 10;
        //this.niceTick = options.niceTick || false;

        //this.yDbList = {}


    }


    init(){
        //this.isInit=true;
        this.initItemWidth(this._options);
        this._originItemWidth = this.itemWidth;
        this._buildInitAxis()
    }
    
    /**
     * itemWidth的数值，由子类给出。itemWidth算出后，才能计算具体的x轴的坐标
     * itemWidth 一直为当前数据项所占宽度。放大缩小后，itemWidth会变化
     * _originItemWidth 中为最初的itemWidth，itemWidth和_originItemWidth的比值，为scale的数值。
     */
    initItemWidth(options){
        throw new Error('subClass of XDataBridge should implement initItemWidth')
    }

    /**
     * 以下两个函数为 data添加时，自动算出添加数据项的坐标
     * 暂时不考虑这个优化项，使用`setData`全量更新。

    addLast(arr){
        if(!Utils.Type.isArray(arr)){ arr = [arr] }

        let space = this.itemWidth + this.gap;
        let maxX = this.xAxis[this.xAxis.length -1];
        for(let i = 0;i<arr.length;i++){
            this.data.push(arr[i])
            this.xAxis.push(maxX+space*(i+1));
        }
        return this;
    }

    addFirst(arr){
        if(!Utils.Type.isArray(arr)){arr=[arr]}

        let space = this.itemWidth + this.gap;
        let minX = this.xAxis[0];
        for(let i = 0;i<arr.length;i++){
            this.data.unshift(arr[i])
            this.xAxis.unshift(minX-space*(i+1))
        }
        return this;
    }
    */


    setData(data){
        this.data = data;
        this._buildInitAxis();
    }

    /**
     * @param value canvas上的x坐标，一般为range中一个值
     * @returns number:对应value的xAxis中的索引值。
     *
     * @description 给定一个x，返回数据项中索引。比如用户鼠标移动，要根据x找到对应的数据项，给出tips
     *
     * */
    getIndexByValue(value){
        const xAxis = this.xAxis;
        if(xAxis.length == 0){
            //throw new Error('调用getIndexByValue时，xAxis不能为空')
            return -1;
        }
        const space = this.itemWidth+this.gap;
        return Utils.Algorithms.binarySearch(xAxis,value,function(value,curElem){
            if(curElem >= value-space && curElem <= value){
                return 0
            }else if(curElem+space < value){
                return -1
            }else{
                return 1
            }
        })
    }


    /**
     *
     * @param fn 对x坐标的更新操作函数.传给fn的第一个参数是数据项，第二个是数据项索引
     * @private
     *
     * @description 更新x坐标，并从新计算可视区。所有更新的操作，都应该使用此方法进行更新
     */
    _updateXAxis(fn){
        const xAxis = this.xAxis;
        const [bRange,eRange] = this.range
        const space = this.itemWidth + this.gap;
        let beginIdx=undefined,endIdx= undefined;
        for(let i = 0;i<xAxis.length;i++){
            xAxis[i] = fn(xAxis[i],i)
            if(beginIdx===undefined && xAxis[i] + space >= bRange){
                beginIdx = i;
            }
            if(endIdx === undefined && xAxis[i] >= eRange){
                endIdx = i;
            }
        }
        beginIdx = beginIdx === undefined?0:beginIdx
        endIdx = endIdx === undefined?xAxis.length:endIdx

        this.viewDomain=[beginIdx,endIdx];
    }

    /**
     * @description: 构造x坐标。
     */
    _buildInitAxis(){
        const range = this.range,
            data = this.data,
            begin = range[0],
            space = this.itemWidth + this.gap;

        let offset = 0

        //是否需要`右对齐`。
        //if(!this.isInit) {
        //    this.isInit = true;
        if (this.displayCount!==undefined && this.displayCount < data.length && this.direction == 'end') {
            offset = (data.length - this.displayCount) * space
        }
        //}

        //计算出的x轴上的坐标，于data中的数据项一一对应。
        this.xAxis = new Array(this.data.length);

        const realOffset = begin-offset;

        this._updateXAxis(function(item,idx){
            return space*idx + realOffset
        })


        return this;
    }

    /**
     *
     * @returns {Array}ticks的相关信息（domainValue为实际的值，rangeValue为在x轴上的位置，index为实际数据组的索引）
     */
    getTicks() {
        const halfSpace = (this.itemWidth + this.gap)/2
        const beginIdx =0, endIdx = this.data.length-1
        const data = this.data;
        const beginDate = this.beginDate || data[beginIdx],
            endDate = this.endDate || data[endIdx-1];

        const xAxis = this.xAxis;

        const timeScale = Utils.Math.TimeScale([beginDate, endDate],
            [xAxis[0],xAxis[xAxis.length-1]]
        );

        const scale = this.scale>1?this.scale :1;
        const ticks = timeScale.ticks(Math.round(this.tickCount*scale))

        let ticksWithoutOutBound= []
        for(let i = 0;i<ticks.length;i++){
            let tick = ticks[i];
            let index = Utils.Algorithms.binarySearch(this.data,tick);

            if(index==-1)continue;
            ticksWithoutOutBound.push({
                domainValue:this.data[index],
                rangeValue:this.xAxis[index]+halfSpace,
                index:index
            })
        }
        return ticksWithoutOutBound;
    }

    getItemWidth(){
        return this.itemWidth;
    }

    getGap(){
        return this.gap
    }

    getData(){
        return this.data;
    }

    getViewData(){
        let [beginIdx,endIdx] = this.viewDomain;
        return this.data.slice(beginIdx,endIdx)
    }

    getViewDomain(){
        return this.viewDomain;
    }

    getRange(){
        return this.range
    }


    /**
     * @returns {Array.<T>} 可视区内的x轴坐标
     */
    getXAxis(){
        const [beginIdx,endIdx] = this.viewDomain
        return this.xAxis.slice(beginIdx,endIdx);
    }

    getDataByIndex(index){
        return this.data[index]
    }


    /**
     *
     * @param factor 缩放比例
     * @param val 在那一点（x坐标）进行缩放
     *
     * @description 这里的缩放，数据项直接的gap不便，itemWidth缩放
     */
    setScale(factor,val){
        const scale = this.scale * factor;
        if(scale > this.scaleRange[1] || scale<this.scaleRange[0]){
            return this;
        }
        this.scale = scale;

        const xAxis = this.xAxis
        const len = xAxis.length

        const maxX = xAxis[len-1],
            minX = xAxis[0];

        const oItemWidth = this.itemWidth;


        //val对于的数据索引
        //如果val超过范围，假设范围进行延伸，算出相应的index
        let index = -1;
        if(val >= maxX){
            index = Math.round(val - maxX)/oItemWidth
        }else if(val <= minX ){
            index = Math.round(val - minX)/oItemWidth
        }else{
            index = this.getIndexByValue(val)
        }

        this.itemWidth = this._originItemWidth * this.scale
        const itemWidth = this.itemWidth;

        const spaceDiff = itemWidth - oItemWidth

        //具体的缩放更新算法，自己体会为什么这样算把。。
        this._updateXAxis(function(item,idx){
            return item + spaceDiff*(idx - index)
        })

        return this;
    }

    /**
     * @param val: 平移的距离。
     */
    setTranslation(val){
        //console.log(val)
        this._updateXAxis(function(item,idx){
            return item + val;
        })
        return this;
    }
}

export class XDataBridgeWithItemWidth extends XDataBridgeBase{

    constructor(options){
        if(!('itemWidth' in options)){
            throw new Error('need itemWidth')
        }
        super(options)
    }

    initItemWidth(options){
        let gap = this.gap;
        let range = this.range;
        let itemWidth = options.itemWidth;
        if(range[0]>=range[1]){
            throw new Error('区间(Range)开始数值，应小于结束数值')
        }
        let len = range[1]-range[0]
        let divObj = Utils.Math.integerDivide(len+gap,itemWidth+gap)
        let count = divObj.div//能够显示的数据个数
        this.displayCount = count;
        let rem = divObj.rem
        itemWidth +=  rem/count;
        this.itemWidth = itemWidth
    }
}

export class XDataBridgeWithFixedCount extends XDataBridgeBase{
    constructor(options){
        //options.direction  = options.direction || 'start'
        if(!('fixedCount' in options)){
            throw new Error('need fixedCount')
        }
        super(options)
    }

    initItemWidth(options){
        this.displayCount = this.fixedCount = options.fixedCount;
        let gap = this.gap;
        let range = this.range;
        let totalWidth = range[1]-range[0]
        let space = totalWidth / this.fixedCount;

        if(space < gap){
            throw new Error('gap too big，itemWidth will be zero or negative')
        }
        this.itemWidth = space-gap;
    }
}

