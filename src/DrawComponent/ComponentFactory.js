import Constant from '../Constant/Constant.js'

import Utils from '../Utils/Utils.js'

import CandleComponent from './DrawComponentImpl/CandleDrawComponent.js'
import LineComponent from './DrawComponentImpl/LineDrawComponent.js'
import AreaComponent from './DrawComponentImpl/AreaDrawComponent.js'
import BarComponent from './DrawComponentImpl/BarDrawComponent.js'
import AvgPriceComponent from './DrawComponentImpl/AvgPriceDrawComponent.js'
import AvgLineComponent from './DrawComponentImpl/AvgLineDrawComponent.js'

var kvArr=[
    [Constant.Component.CANDLE,CandleComponent],
    [Constant.Component.LINE,LineComponent],
    [Constant.Component.BAR,BarComponent],
    [Constant.Component.AVG_PRICE,AvgPriceComponent],
    [Constant.Component.AVG_LINE,AvgLineComponent]
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

const ComponentFactory = function(type,options){
    return new FactoryMap[type](options);
}

export default ComponentFactory