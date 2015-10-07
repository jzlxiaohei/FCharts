//deprecated!!!

import CandlePainter from '../Painter/PainterImpl/CandlePainter.js'
import AreaPainter from '../Painter/PainterImpl/AreaPainter.js'
import LinePainter from '../Painter/PainterImpl/LinePainter.js'
import XGridPainter from '../Painter/PainterImpl/XGridPainter.js'
import YGridPainter from '../Painter/PainterImpl/YGridPainter.js'
import BarPainter from '../Painter/PainterImpl/BarPainter.js'

import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'

var id = Utils.Fn.identify

var kvArr =[
    [Constant.Painter.LINE,LinePainter],
    [Constant.Painter.CANDLE,CandlePainter],
    [Constant.Painter.AREA,AreaPainter],
    [Constant.Painter.X_GRID,XGridPainter],
    [Constant.Painter.Y_GRID,YGridPainter]
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

var PainterFactory=function(type,options){
    //if(type in FactoryMap){
        return new FactoryMap[type](options)
    //}
    //else return undefined
}

export default PainterFactory;

