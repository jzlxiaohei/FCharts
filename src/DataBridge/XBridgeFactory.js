import {XDataBridgeWithItemWidth,XDataBridgeWithFixedCount} from './XDataBridge.js'
import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'

var kvArr =[
    [Constant.XBridge.FIXED_COUNT,XDataBridgeWithFixedCount],
    [Constant.XBridge.ITEM_WIDTH,XDataBridgeWithItemWidth]
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

const XBridgeFactory = function(type,options){
    return new FactoryMap[type](options);
}

export default XBridgeFactory