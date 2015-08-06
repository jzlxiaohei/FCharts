import PainterBase from './PainterBase.js'

class CandlePainter extends PainterBase{
    constructor(opt){
        super(opt);
    }

    draw(){
        var ctx = this.ctx;
        var xArr = this.xArr;
        var yArr = this.yArr;
        var width = this.style.candleWidth || 6;
        //console.log(this.style)
        for(var i = 0;i<yArr.length;i++){
            var d = yArr[i]
            var x1 = xArr[i],
                open = d.open,
                close = d.close,
                high = d.high,
                low = d.low

            var x2 = x1 + width
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
