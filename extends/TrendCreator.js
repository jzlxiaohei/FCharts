import utils from './utils.js'

const dateStr2Obj = utils.dateStr2Obj



export default class TrendCreator{
    constructor(FCharts,HsDataFactoryList,options) {
        this.FCharts = FCharts;
        this.HsDataFactoryList = HsDataFactoryList;
        this.domId = options.domId;
        this.hsReqData = options.hsReqData
        this.canvasOptions = options.canvasOptions||{};
        this.chartOptions = options.chartOptions||{};
        this.hsCode = this.hsReqData['hsCode'];
        this.onAfterRender = options.onAfterRender
        this._init();
    }

    _init(){
        this._renderWithData();
    }

    _renderWithData(){

        const {
            canvasHeight,
            canvasWidth,
            canvasId,
            canvasEventId
            } = utils.createDom(this.domId,this.canvasOptions);

        const hsCode = this.hsReqData['hsCode'];

        if(!hsCode){throw new Error('hsCode  must be set')}

        let chart, hsClient;

        this.HsDataFactoryList['real']({
            fields:'preclose_px',
            en_prod_code:hsCode
        }).onDataReady(e=>{
            const snapshot = e.snapshot
            var fields = snapshot.fields;
            let precloseIndex = 0

            for(var i = 0;i<fields.length;i++){
                if(fields[i]=='preclose_px'){
                    precloseIndex =  i;
                    break;
                }
            }
            const preclose = snapshot[hsCode][precloseIndex];
            chart = this._createChart({
                canvasId,
                canvasEventId,
                canvasWidth,
                canvasHeight,
                preclose
            })

            hsClient = this.HsDataFactoryList['trend']({
                prod_code:hsCode,
                fields:'last_px,avg_px,business_amount'
            },{loop:true}).onDataReady(e=>{
                this._drawReal(chart,e,hsCode,preclose)

                if(typeof this.onAfterRender =='function'){
                    this.onAfterRender({
                        hsClient,
                        chart
                    })
                }
            }).init()


        }).init()

        return{
            hsClient,
            chart
        }
    }

    _drawReal(chart,e,hsCode,preclose){
        var trendObj = e.trend;

        var fields = trendObj.fields;
        var _m = {}
        for(var i = 0;i<fields.length;i++){
            _m[fields[i]] = i;
        }


        var data = trendObj[hsCode]


        var xData = [],pxData=[],barData=[],avgData=[],candleData=[];
        data.forEach(function(item,index){
            xData.push(dateStr2Obj(item[_m['min_time']]))
            pxData.push( (item[_m['last_px']]-preclose)/preclose  )

            var preAmount= index >0? data[index-1][_m['business_amount']] : 0
            var pre_px = index>0? data[index-1][_m['last_px']] : 0

            barData.push(item[_m['business_amount']] -preAmount)
            avgData.push(( item[_m['avg_px']]-preclose) /preclose)
            candleData.push({
                open:pre_px,
                close:item[_m['last_px']]
            })
        })


        chart.setData({
            x:xData,
            '1m_bar':{
                data:barData,
                candleData:candleData
            },
            '1m_line_real':pxData,
            '1m_line_avg':avgData
        })
        chart.render();
    }

    _createChart(options){
        const {
            canvasId,
            canvasEventId,
            canvasWidth,
            canvasHeight,
            preclose
            } = options
        const chartOptions = this.chartOptions
        const FCharts = this.FCharts;
        let defaultOptions = {
            ctx: document.getElementById(canvasId).getContext('2d'),
            drawCanvas: document.getElementById(canvasId),
            eventCanvas: document.getElementById(canvasEventId),
            xAxis:{
                fixedCount:241, range:[0,canvasWidth], data:[]
            },
            tips:function(item){
                const x = item.x,
                    y=item['1m_line_real'],
                    b=item['1m_bar'];
                //if(x)return undefined;
                return `
                时间:${x.getHours()}:${x.getMinutes()}}\n
                价格:${y['last_px']}
                成交量:${b['business_amount']}手
            `
            },
            series:{
                '1m_line_real':{
                    axisType:'symmetry',data:[],
                    range:[15,0.6*canvasHeight],
                    type:'line',
                    tickCount: 5,
                    gridColor: '#555',
                    yGridOn:true,
                    xGridOn:true,
                    xTickList:{
                        data:[
                            {x:0,text:{text:'9点30分',textAlign:'left'}},
                            {x:canvasWidth/2,text:{text:'11点30分'}},
                            {x:canvasWidth,text:{text:'15点00分',textAlign:'right'}},
                        ]
                    },
                    style:{
                        line:{
                            brushType:'stroke',
                            lineWidth:1,
                            strokeStyle:'#0af'
                        }
                    },
                    labels:[{
                        pos: 'left',
                        top:2,
                        place:'inner',
                        value: function (i) {
                            return ((i*preclose)+preclose).toFixed(2)
                        },
                        style:function(domainValue,rangeValue){
                            if(domainValue==0){
                                return {
                                    fillStyle:'#a9a9a9'
                                }
                            }else if(domainValue<0){
                                return{
                                    fillStyle:'#50c88c'
                                }
                            }else{
                                return {
                                    fillStyle:'#f85c5c'
                                }
                            }
                        }
                    },{
                        pos: 'right',
                        place:'inner',
                        top:2,
                        value: function (i) {
                            return (i*100).toFixed(2)+'%'
                        },
                        style:function(domainValue){
                            if(domainValue==0){
                                return {
                                    fillStyle:'#a9a9a9'
                                }
                            }else if(domainValue<0){
                                return{
                                    fillStyle:'#50c88c'
                                }
                            }else{
                                return {
                                    fillStyle:'#f85c5c'
                                }
                            }
                        }
                    }]
                },
                '1m_line_avg':{
                    range: [20, 0.6*canvasHeight],
                    data: [],
                    type: 'avgPrice',
                    parentSeries:'1m_line_real',
                    style:{
                        line:{
                            brushType:'stroke',
                            lineWidth:1,
                            strokeStyle:'#A77C42'
                        }
                    }
                },
                '1m_bar':{
                    range:[0.6*canvasHeight+30,canvasHeight],
                    data:[], candleData:[], type:'bar',
                    tickCount:3,
                    labels:[ {
                        pos:'right',
                        place:'inner',
                        value:function(item){
                            if(item>1000000){
                                var num = Math.round(item/1000000)
                                return num+'万手'
                            }
                            return ( Math.round(item/100) )+ '手'
                        }
                    }],
                    yGridOn:true,
                    dataMin:0
                }

            }
        }

        const finalOptions = utils.deepmerge(defaultOptions, chartOptions)
        return new FCharts.Chart(finalOptions);
    }
}




