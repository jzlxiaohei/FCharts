import PainterBase from './PainterBase.js'

/*
* 和LinePainter的实现算法一样
*
*  1: LinePainter 是 stroke
*
*  2: AreaPainter 是 fill ，另外多两个点，用于设定x轴
* */

class AreaPainter extends PainterBase{
    constructor(opt={}){
        super(opt);
        this.propName = opt.propName || 'close'
    }

    draw(){
        var ctx = this.ctx;
        var xArr = this.xArr;
        var yArr = this.yArr;
        if(xArr.length ===0 || yArr.length===0){
            throw new Error('xArr and yArr should not be empty')
        }
        var propName = this.propName;
        ctx.moveTo(xArr[0],yArr[0][propName])

        var len = Math.min(yArr.length,xArr.length)
        for(var i = 1;i<len;i++){
            var y = yArr[i][propName]
            var x = xArr[i]
            ctx.lineTo(x,y)
        }
        this.setStyle({
            brushType:'stroke'
        })
        this.afterDraw();

        ctx.lineTo(xArr[len-1],600)
        ctx.lineTo(xArr[0],600)

        this.setStyle({
            brushType:'fill'
        })
    }
}

export default AreaPainter;
