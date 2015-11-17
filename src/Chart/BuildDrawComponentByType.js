/**
 * build DrawComponent by type
 *
 * 每个DrawComponent 需要哪些options,这里相当于文档了。
 * */

import invariant from 'invariant'
import Constant from '../Constant/Constant.js'
import CpFactory from '../DrawComponent/ComponentFactory.js'

const {
    BAR,
    AREA,
    LINE,
    CANDLE,
    AVG_LINE,
    AVG_PRICE
    } = Constant.Component

//true means: this option is required
const CommonOptions={
    range:true,//array with two itme
    data:true,//array
    xBridge:true,//instance of XDataBridge implementation
    chart:true,//instance of Chart

    axisType:false,
    yGridOn:false,//boolean
    xGridOn:false,//boolean
    tickCount:false,//number
    labels:false,//object with config
    niceTick:false,//boolean
    style:false,//object with config,merge with DefaultStyle
    xTextFormat:false,//function,format x label.
    xTickList:false//object(data:[],y0,y1)
}

const CandleOptions={

}
const LineOptions={

}

const AreaOptions={

}

const BarOptions={
    candleData:true//bar:成交量等的图。需要根据candleData来确定是红还是绿（是涨还是跌）
}

const AvgPriceOptions={
    parentSeries:true
}

const AvgLineOptions={
    parentSeries:true,
    avgLines:true
}



function checkOptions(checdOptions,specOptions,prevMsg){
    for(let i in CommonOptions){
        if(CommonOptions[i]){
            invariant(
                (i in checdOptions),
                `${prevMsg} property ${i} is required`
            )
        }
    }
    for(let i in specOptions){
        if(specOptions[i]){
            invariant(
                (i in checdOptions),
                `${prevMsg} property ${i} is required`
            )
        }
    }
}

function buildBarDrawComponent(options){
    checkOptions(options,BarOptions,'BarDrawComponent:')
    return CpFactory(BAR,options)
}

function buildCandleDrawComponent(options){
    checkOptions(options,CandleOptions,'CandleDrawComponent:')
    return CpFactory(CANDLE,options)
}

function buildLineDrawComponent(options){
    checkOptions(options,LineOptions,'LineDrawComponent:')
    return CpFactory(LINE,options)
}

function buildAvgPriceDrawComponent(options){
    checkOptions(options,AvgPriceOptions,'AvgPriceComponent:')
    return CpFactory(AVG_PRICE,options)
}

function buildAvgLineDrawComponent(options){
    checkOptions(options,AvgLineOptions,'AvgLineComponent:')
    return CpFactory(AVG_LINE,options)
}


function BuildDrawComponentByType(type,options){
    switch (type){
        case BAR:
            return buildBarDrawComponent(options)
        case CANDLE:
            return buildCandleDrawComponent(options)
        case LINE:
            return buildLineDrawComponent(options)
        case AREA:
            throw new Error('not implement')
        case AVG_LINE:
            return buildAvgLineDrawComponent(options)
        case AVG_PRICE:
            return buildAvgPriceDrawComponent(options)
        default:
            throw new Error(`type:${type} not supported`)
    }
}

export default BuildDrawComponentByType