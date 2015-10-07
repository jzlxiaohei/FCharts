import Utils from '../Utils/Utils.js'

function onMove(context){
    const chart = context.__chart;

    const {eventCanvas,x,y} = context
    const eventCtx = eventCanvas.getContext('2d');

    var info = chart.getInfoByX(x);

    eventCtx.clearRect(0,0,eventCanvas.width,eventCanvas.height);
    eventCtx.save()
    eventCtx.beginPath();
    eventCtx.strokeStyle=chart.style.crossColor
    eventCtx.fillStyle=chart.style.tipColor;
    eventCtx.font='18px'
    eventCtx.moveTo(x,0)
    eventCtx.lineTo(x,eventCanvas.height)
    //eventCtx.fillText(chart.xBridge.getIndexByValue(x),10,10)
    eventCtx.stroke()

    if(!info.outBound){
        var text = chart.tips(info);
        Utils.Canvas.wrapText(eventCtx,text,x,y,200,20)
    }
    eventCtx.restore();
}

export default {
    onMove
}