import Constant from '../Constant/Constant.js'

import Utils from '../Utils/Utils.js'

import CandleComponent from './DrawComponentImpl/CandleComponent.js'
import LineComponent from './DrawComponentImpl/LineDrawComponent.js'
import AreaComponent from './DrawComponentImpl/AreaComponent.js'
import BarComponent from './DrawComponentImpl/BarDrawComponent.js'

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