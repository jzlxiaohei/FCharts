import PainterBase from './PainterBase.js'

/*
* 和LinePainter的实现算法一样
*
*  1: LinePainter 是 stroke
*
*  2: AreaPainter 是 fill ，另外多两个点，用于设定x轴
* */

class AreaPainter extends PainterBase{
    constructor(opt){
        super(opt);
        this.propName = opt.propName || 'close'
    }

    draw(){
        var ctx = this.ctx;
        //TODO how to set start point and end point ???
        var yArr = this.yArr;
        var xArr = this.xArr;
        ctx.moveTo(xArr[0],yArr[0])

        for(var i = 1;i<xArr.length && i<yArr.length;i++){
            var y = yArr[i][propName]
            var x = xArr[i]
            ctx.lineTo(x,y)
        }
    }
}

export default AreaPainter;
