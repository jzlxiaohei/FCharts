const upColor='#f85c5c',
    downColor='#50c88c';


let DefaultStyle ={
    canvasColor:'#FFFFFF',

    candleUp:{
        fillStyle: upColor,
        brushType: 'both',
        strokeStyle: "#f85c5c"
    },
    candleDown:{
        strokeStyle: downColor,
        brushType: 'stroke'
    },
    line:{
        brushType:'stroke',
        lineWidth:1,
        strokeStyle:'#666'
    },
    avgLine_5:{
            brushType:'stroke',
            lineWidth:1,
            strokeStyle:'yellow'
    },
    'avgLine_10':{
        brushType:'stroke',
        lineWidth:1,
        strokeStyle:'blue'
    },
    'avgLine_20':{
        brushType:'stroke',
        lineWidth:1,
        strokeStyle:'white'
    },
    barUp:{
        fillStyle:upColor,
        brushType:'fill'
    },
    barDown:{
        strokeStyle:downColor,
        brushType:'stroke'
    },
    gridColor:'#666',
    tickLabelColor:'#a9a9a9',
    crossColor:'#999999',
    tipColor:'#f1f1f1',
    gridWidth:1
}

export default DefaultStyle