import PainterBase from './PainterBase.js'

class CandlePainter extends PainterBase{
    constructor(opt){
        super(opt);
        this.setStyle({
            brushType:'fill'
        })
    }

    draw(){
        var ctx = this.ctx;
        var xArr = this.xArr;
        var yArr = this.yArr;
        var width = this.style.itemWidth || 6;
        var y = this.yRange[1]

        for(var i = 0;i<yArr.length;i++){
            var height = yArr[i]
            var x = xArr[i]

            //ctx.fillRect(x,y-height,width,height)
            ctx.moveTo(x,y)
            ctx.lineTo(x,y-height)
            ctx.lineTo(x+width,y-height)
            ctx.lineTo(x+width,y)
            ctx.closePath()
        }
    }

}

export default CandlePainter;
