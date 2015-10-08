import PainterBase from './PainterBase.js'

class CandlePainter extends PainterBase{
    constructor(options={}){
        super(options);
    }

    draw(){
        var ctx = this.ctx;
        var xAxis = this.xAxis;
        var yAxis = this.yAxis;
        var itemWidth = this.style.itemWidth|| 6;
        for(var i = 0;i<yAxis.length;i++){
            var d = yAxis[i]
            var x1 = xAxis[i],
                open = d.open,
                close = d.close,
                high = d.high,
                low = d.low

            var x2 = x1 + itemWidth
            var midX = (x1+x2)/2

            //画矩形
            ctx.moveTo(x1,open);
            ctx.lineTo(x2, open);
            ctx.lineTo(x2, close);
            ctx.lineTo(x1, close);
            ctx.lineTo(x1,open);


            //画上下两根线
            var _big,_small;

            //y轴是从上到下的方向，大小是相反的
            if(open>close){
                _big = close,_small = open
            }else{
                _big = open,_small = close
            }

            ctx.moveTo(midX,_big)
            ctx.lineTo(midX,high)

            ctx.moveTo(midX,_small)
            ctx.lineTo(midX,low)
        }
    }

}

export default CandlePainter;
