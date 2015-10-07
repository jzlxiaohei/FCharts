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
        //this.propName = opt.propName || 'close'
    }

    render(){
        this.beforeDraw();
        var xAxis = this.xAxis;
        var yAxis = this.yAxis;
        if(xAxis.length ===0 || yAxis.length===0){
            throw new Error('xAxis and yAxis should not be empty')
        }
        //var propName = this.propName;
        //ctx.moveTo(xAxis[0],yAxis[0][propName])

        var len = Math.min(yAxis.length,xAxis.length)
        for(var i = 1;i<len;i++){
            //var y = yAxis[i][propName]
            var x = xAxis[i],
                y = yAxis[i]
            ctx.lineTo(x,y)
        }

        this.setStyle({brushType:'stroke'})
        this.afterDraw();

        ctx.lineTo(xAxis[len-1],this.xRange[0])
        ctx.lineTo(xAxis[0],this.xRange[1])

        this.setStyle({brushType:'fill'})
        this.afterDraw();
    }

    //draw(){
    //    var ctx = this.ctx;
    //    var xAxis = this.xAxis;
    //    var yAxis = this.yAxis;
    //    if(xAxis.length ===0 || yAxis.length===0){
    //        throw new Error('xAxis and yAxis should not be empty')
    //    }
    //    var propName = this.propName;
    //    ctx.moveTo(xAxis[0],yAxis[0][propName])
    //
    //    var len = Math.min(yAxis.length,xAxis.length)
    //    for(var i = 1;i<len;i++){
    //        var y = yAxis[i][propName]
    //        var x = xAxis[i]
    //        ctx.lineTo(x,y)
    //    }
    //    this.setStyle({
    //        brushType:'stroke'
    //    })
    //    this.afterDraw();
    //
    //    ctx.lineTo(xAxis[len-1],600)
    //    ctx.lineTo(xAxis[0],600)
    //
    //    this.setStyle({
    //        brushType:'fill'
    //    })
    //}
}

export default AreaPainter;
