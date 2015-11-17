
import utils from './utils.js'


function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
        val = '0' + val;
    }
    return val;
}

/**
 *
 * @param candle_period
 *          取值可以是数字1-9，表示含义如下：
             1：1分钟K线
             2：5分钟K线
             3：15分钟K线
             4：30分钟K线
             5：60分钟K线
             6：日K线
             7：周K线
             8：月K线
             9：年K线
 *
 */
function dateFormat(d,candle_period){
    if(!candle_period){
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}:${pad(d.getHours())}-${pad(d.getMinutes())}`
    }

    if(candle_period<6){
        return `${pad(d.Date())}月${pad(d.getHours())}时${pad(d.getMinutes())}分`
    }
    if(candle_period<8){
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
    }
    return d.getFullYear()+''
}

export default class KLineCreator {

    constructor(FCharts,HsDataFactoryList,options) {
        this.FCharts = FCharts;
        this.HsDataFactoryList = HsDataFactoryList;
        this.domId = options.domId;
        this.hsReqData = options.hsReqData
        this.canvasOptions = options.canvasOptions||{};
        this.chartOptions = options.chartOptions||{};
        //this.yData = [], this.xData = [], this.barData = [];
        this.hsCode = this.hsReqData['hsCode'];
        this.beginDate = '';
        this.noMoreData = false;
        this.defaultDataCount = 100;
        this.isFetching = false;
        this._init();
    }

    _init() {
        this.kChart = this._createChart()
        this._renderWithData(true)
        this.kChart.on('afterRender', chart=> {
            if (this.noMoreData) {
                return;
            }
            const xAxis = chart.xBridge.getXAxis();
            const xRange = chart.xBridge.getRange();
            if (xAxis.length > 0) {
                const xBegin = xAxis[0],
                    xBeginRange = xRange[0]
                if (xBegin - xBeginRange > 50) {
                    this._renderWithData();
                }
            }
        })
    }

    _renderWithData(isInit) {
        if(this.isFetching)return;
        this.isFetching = true;

        const hsReqData = this.hsReqData;
        this.dataCount = hsReqData.data_count || this.defaultDataCount

        this.HsDataFactoryList['kline']({
            prod_code: hsReqData['hsCode'],
            get_type: 'offset',
            candle_period: hsReqData['candle_period'],
            data_count: this.dataCount,
            date: this.beginDate
        }).onDataReady(e=> {
            this.isFetching = false;
            this._processKlineData(e,isInit)
        }).init()
    }

    _processKlineData(e,isInit) {
        const candle = e.candle;
        const _m = utils.keyValueInvert(candle.fields);
        const data = candle[this.hsCode];

        if (data.length < this.dataCount) {
            this.noMoreData = true;
        }

        const yData=[],xData=[],barData=[];

        for (var i = 0; i <data.length; i++) {
            var cd = data[i]
            yData.push({
                open: ( cd[_m['open_px']] ),
                high: cd[_m['high_px']],
                low: cd[_m['low_px']],
                close: cd[_m['close_px']]
            })
            xData.push(utils.dateStr2Obj(cd[_m['min_time']]))
            barData.push(cd[_m['business_amount']])
        }

        if(isInit){
            this.kChart.setData({
                x: xData,
                'candle': yData,
                'bar': {
                    data: barData,
                    candleData: yData
                }
            })
        }else{
            this.kChart.addFirst({
                x: xData,
                'candle': yData,
                'bar': {
                    data: barData,
                    candleData: yData
                }
            })
        }
        this.beginDate = data[0][_m['min_time']];
        this.kChart.render();

    }

    _createChart() {
        const FCharts = this.FCharts;
        const chartOptions = this.chartOptions
        const {
            canvasHeight,
            canvasWidth,
            canvasId,
            canvasEventId
            }=utils.createDom(this.domId,this.canvasOptions)


        let defaultOptions = {
            ctx: document.getElementById(canvasId).getContext('2d'),
            drawCanvas: document.getElementById(canvasId),
            eventCanvas: document.getElementById(canvasEventId),
            xAxis: {
                range: [0, canvasWidth], data: [],
                itemWidth: 4,
                gap: 2,
                tickCount:7
            },
            movable: true,
            zoomable: true,
            tips:  (item)=> {
                const x = item.x,
                    y = item['candle'],
                    b = item['bar'];
                return `
                    ${dateFormat(x)}
                    开 ${y.open},收 ${y.close}
                    高 ${y.high},低 ${y.low}
                    成交:${b}手
                `
            },
            series: {
                'candle': {
                    range: [20, 0.6 * canvasHeight],
                    type: 'candle',
                    data: [],
                    yGridOn: true,
                    xGridOn: true,
                    tickCount: 10,
                    niceTick: true,
                    labels: [{
                        pos: 'left', top: 2, place: 'inner',
                        value: function (i) {
                            return (i).toFixed(2)
                        }
                    }],
                    xTextFormat:item=> {
                        return `${dateFormat(item,this.hsReqData['candle_period'])}`
                    }
                },
                'avgLine5d':{
                    range:[20,0.6*canvasHeight],
                    parentSeries:'candle',
                    data:[],
                    type:'avgLine',
                    avgLines:[5,10,20]
                },
                'bar': {
                    range: [0.6 * canvasHeight + 30, canvasHeight],
                    type: 'bar',
                    data: [],
                    candleData: [],
                    tickCount: 3,
                    labels: [{
                        pos: 'right',
                        place: 'inner',
                        value: function (item) {
                            if (item > 1000000) {
                                var num = Math.round(item / 1000000)
                                return num + '万手'
                            }
                            return ( Math.round(item / 100) ) + '手'
                        }
                    }],
                    yGridOn: true,
                    dataMin: 0
                }

            }
        }


        const finalOptions = utils.deepmerge(defaultOptions, chartOptions)
        return new FCharts.Chart(finalOptions);
    }
}