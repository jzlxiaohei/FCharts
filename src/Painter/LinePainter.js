import PainterBase from './PainterBase.js'

class LinePainter extends PainterBase{
    constructor(opt){
        super(opt)
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
        for(var i = 1;i<yArr.length && i<xArr.length;i++){
            var y = yArr[i][propName]
            var x = xArr[i]
            ctx.lineTo(x,y)
        }
    }

    afterDraw(){
        var style = this.style;
        if(style.lineDash){
            if(typeof  ctx.setLineDash == 'function'){
                ctx.setLineDash(style.lineDash)
            }else{
                console.warn('setLineDash not support in your browser')
            }
        }
        super.afterDraw()
    }
}


export default LinePainter;