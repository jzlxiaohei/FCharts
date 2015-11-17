import PainterBase from './PainterBase.js'

class LinePainter extends PainterBase{
    constructor(opt={}){
        super(opt)
    }

    draw(){
        const ctx = this.ctx;
        const xAxis = this.xAxis;
        const yAxis = this.yAxis;
        const gap = this.style.gap||0,
            itemWidth = this.style.itemWidth||6;
        if(xAxis.length ===0 || yAxis.length===0){
            console.error('xAxis and yAxis should not be empty')
        }

        let offset = gap/2+itemWidth/2

        const len = Math.min(yAxis.length,xAxis.length)

        ctx.moveTo(xAxis[0]+offset,yAxis[0])
        for(var i = 1;i<len;i++){
            var y = yAxis[i]
            var x = xAxis[i]+offset
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