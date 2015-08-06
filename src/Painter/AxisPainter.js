import PainterBase from './PainterBase.js'

class AxisPainter extends PainterBase{
    constructor(options){
        super(options)

        this.axisKind=options.axisKind;

        this.orient = options.orient;

        if(!this.orient){
            this.orient = (this.axisKind=='x'?'top':'right')
        }

        this.ticks = options.ticks;
        this.tickLine = options.tickLine || 3;
        this.startPoint = options.startPoint
        this.endPoint = options.endPoint;
    }

    setStartPoint(sPt){
        this.startPoint = sPt;
        return this;
    }

    setEndPoint(ePt){
        this.endPoint = ePt;
        return this;
    }

    setTicks(ticks){
        this.ticks = ticks;
    }

    draw(){
        this._drawLine()
        this._drawTicks()
    }

    _drawLine(){
        var [a,b] = this.startPoint,
            [c,d] = this.endPoint;

        var ctx = this.ctx;
        ctx.moveTo(a,b)
        ctx.lineTo(c,d);
    }

    _drawTicks(){
        var ticks = this.ticks
        var orient = this.orient;
        var tickDiff = this.tickLine
        if(orient == 'top' || orient =='left'){
            tickDiff = -tickDiff;
        }

        if(this.orient =='top' || this.orient =='bottom'){

            for(var i = 0;i<ticks.length;i++){
                var tick = ticks[i];
                var x = tick.x,
                    y = tick.y;
                ctx.moveTo(x,y)
                ctx.lineTo(x,y + tickDiff)
            }
        }else{

            for(var i = 0;i<ticks.length;i++){
                var tick = ticks[i];
                var x = tick.x,
                    y = tick.y;
                ctx.moveTo(x,y)
                ctx.lineTo(x+tickDiff,y)
            }
        }

    }

}