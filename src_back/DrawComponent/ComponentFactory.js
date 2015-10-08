import Constant from '../Constant/Constant.js'

import Utils from '../Utils/Utils.js'

import CandleComponent from './CandleComponent.js'
import LineComponent from './LineDrawComponent.js'
import AreaComponent from './AreaComponent.js'
import BarComponent from './BarDrawComponent.js'

var kvArr=[
    [Constant.Component.CANDLE,CandleComponent],
    [Constant.Component.LINE,LineComponent],
    [Constant.Component.BAR,BarComponent]
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

const ComponentFactory = function(type,options){
    return new FactoryMap[type](options);
}

export default ComponentFactory