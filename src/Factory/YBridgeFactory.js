import {YDataBridge,YDataBridgeWidthPreClose} from '../DataBridge/YDataBridge.js'

import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'


var kvArr =[
    [Constant.YBridge.OHLC, YDataBridge],
    [Constant.YBridge.OHLC_PRECLOSE, YDataBridgeWidthPreClose]
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

const YBridgeFactory = function(type,options){
    return new FactoryMap[type](options);
}

export default YBridgeFactory
