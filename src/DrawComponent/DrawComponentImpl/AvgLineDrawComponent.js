//均线，用于k线图

import BaseDrawComponent from './DrawComponentBase.js'

import Constant from '../../Constant/Constant.js'
import PainterFactory from '../../Painter/PainterFactory.js'


export default class AvgLineDrawComponent extends BaseDrawComponent{
    constructor(options){
        super(options);
        const avgLines = options.avgLines;
        this.linePainterList = {}
        this.avgDataList = {}
        /**
         * this.linePainterList = {
         *      5: linePainter, //5份均线,根据数据，可能是5日，可能是5分钟
         *      10:linePainter, //..
         *      20:linePainter
         * }
         */
        for(let i=0;i<avgLines.length;i++){
            this.linePainterList[avgLines[i]] = PainterFactory(Constant.Painter.LINE);
            this.avgDataList[avgLines[i]] = []
        }
        //this.data = options.data;
        this.parentSeries = options.parentSeries;
        this.isAvgInit = false;
        this.yBridge = this.chart
            .getComponent(this.parentSeries)
            .getYBridge()

    }

    setData(data){
        //直接依赖于parentSeries的数据，为空。不覆写也不行
        this._calcAvg()
    }
    //
    addFirst(data){
        //直接依赖于parentSeries的数据，为空
        this._calcAvg()
    }

    beforeDraw(){
        //this.yBridge.setViewDomain(this.xBridge.getViewDomain());
        this.ctx = this.chart.ctx;
    }

    _clear(){
        for(let i in this.avgDataList){
            this.avgDataList[i] = [];
        }
    }
    _calcAvg(){
        this._clear();
        const yBridge = this.yBridge;
        const data = yBridge.getData();


        for(let i = 0;i<data.length;i++){
            for(let avg in this.avgDataList){
                const value = this._calcSingle(data,i,+avg);
                this.avgDataList[avg].push(value)
            }
        }
    }

    _calcSingle(data,index,avg){
        //data = data.close || data;
        if(index<avg-1)return undefined;
        else{
            let sum = 0;
            for(let i=0;i<avg;i++){
                let dataItem = data[index-i]
                sum += (dataItem.close||dataItem)
            }
            return sum / avg;
        }
    }

    _findIndexOfFirstNoUndefined(avgData,beginIndex,endIndex){
        for(let i = beginIndex;i<endIndex;i++){
            if(avgData[i]!==undefined){
                return i;
            }
        }
        return endIndex;
    }

    draw(){
        if(!this.isAvgInit){
            this._calcAvg();
            this.isAvgInit = true;
        }

        const xAxis = this.xBridge.getXAxis('all');

        const [bIndex,eIndex] = this.xBridge.getViewDomain();

        const gap = this.xBridge.getGap(),
            itemWidth = this.xBridge.getItemWidth();


        for(let i in this.avgDataList) {

            const linePainter = this.linePainterList[i],
                avgData = this.avgDataList[i];

            //const viewAvgData = avgData.slice(bIndex,eIndex)
            const firstIndex = this._findIndexOfFirstNoUndefined(avgData,bIndex,eIndex);
            const avgAxis = this.yBridge.interpolation(avgData.slice(firstIndex,eIndex))

            linePainter
                .setCtx(this.ctx)
                .setXAxis(xAxis.slice(firstIndex,eIndex))
                .setYAxis(avgAxis)
                .setStyle(this.style['avgLine_' + i])
                .setStyle({
                    itemWidth,
                    gap
                }).render()

        }
    }

}


