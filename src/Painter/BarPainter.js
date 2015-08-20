import PainterBase from './PainterBase.js'

class BarPainter extends PainterBase{
    constructor(opt={}){
        super(opt);
        this.setStyle({
            brushType:'fill'
        })
    }

    draw(){
        var ctx = this.ctx;
        var xAxis = this.xAxis;
        var yAxis = this.yAxis;
        var width = this.style.itemWidth || 6;
        var y = this.yRange[1]

        for(var i = 0;i<yAxis.length;i++){
            var height = yAxis[i]
            var x = xAxis[i]

            //ctx.fillRect(x,y-height,width,height)
            ctx.moveTo(x,y)
            ctx.lineTo(x,height)
            ctx.lineTo(x+width,height)
            ctx.lineTo(x+width,y)
            ctx.closePath()
        }
    }

    setDefaultStyle(){

    }

}

export default BarPainter;
