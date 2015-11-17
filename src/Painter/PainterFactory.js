import CandlePainter from './PainterImpl/CandlePainter.js'
import AreaPainter from './PainterImpl/AreaPainter.js'
import LinePainter from './PainterImpl/LinePainter.js'
import XGridPainter from './PainterImpl/XGridPainter.js'
import YGridPainter from './PainterImpl/YGridPainter.js'
import BarPainter from './PainterImpl/BarPainter.js'
import XGridFixedPainter from './PainterImpl/XGridPainterFixed.js'


import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'

//var id = Utils.Fn.identify

var kvArr =[
    [Constant.Painter.LINE,LinePainter],
    [Constant.Painter.CANDLE,CandlePainter],
    [Constant.Painter.AREA,AreaPainter],
    [Constant.Painter.X_GRID,XGridPainter],
    [Constant.Painter.Y_GRID,YGridPainter],
    [Constant.Painter.BAR,BarPainter],
    [Constant.Painter.X_GRID_FIXED,XGridFixedPainter],
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

var PainterFactory=function(type,options){
    //if(type in FactoryMap){
        return new FactoryMap[type](options)
    //}
    //else return undefined
}

export default PainterFactory;

