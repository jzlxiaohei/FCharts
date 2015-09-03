var Constant;

let xAxis= {},

    yAxisList={},

    eventCanvas={},

    drawCanvas={}

    ctx = drawCanvas.getContext('2d')

    movable = false;

    scalable = false;

    tips =function(item){

    }


function createElementByOptions(options={}){

    var xBridge ;
    var xOptions = options.xAxis
    if(xOptions.fixedCount){
        //xBridge = XBridgeFactory('fixedCount',xOptions)
        xBridge = XBridgeFactory(Constant.XBridge.FIXED_COUNT,xOptions)
    }else {
        xBridge = XBridgeFactory(Constant.XBridge.ITEM_WIDTH,xOptions)
    }

    var yAxisList={
        key:yBridge,
    }

    var componentList={
        'key':cp
    };

    

}






