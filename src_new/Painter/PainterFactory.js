import CandlePainter from './CandlePainter.js'
import AreaPainter from './AreaPainter.js'
import LinePainter from './LinePainter.js'
import XGridPainter from './XGridPainter.js'
import YGridPainter from './YGridPainter.js'
import BarPainter from './BarPainter.js'


import Constant from '../Constant/Constant.js'
import Utils from '../Utils/Utils.js'

//var id = Utils.Fn.identify

var kvArr =[
    [Constant.Painter.LINE,LinePainter],
    [Constant.Painter.CANDLE,CandlePainter],
    [Constant.Painter.AREA,AreaPainter],
    [Constant.Painter.X_GRID,XGridPainter],
    [Constant.Painter.Y_GRID,YGridPainter],
    [Constant.Painter.BAR,BarPainter]
]

const FactoryMap = Utils.Common.makeKvObj(kvArr);

var PainterFactory=function(type,options){
    //if(type in FactoryMap){
        return new FactoryMap[type](options)
    //}
    //else return undefined
}

export default PainterFactory;

