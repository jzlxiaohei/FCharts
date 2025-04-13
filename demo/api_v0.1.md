#API design V0.1    
    
    WscnChart({
        type:'1m_real',//1m,5m_real(5d) 1d 1w,
        ctx:ctx
        xAxis:{
            data:[],
            fixedCount:240,//和itemWidth 是互斥的,fixedCount 优先级高，默认是itemWidth
            itemWidth,
            gap,
            range:[0,400],
            show:,
            yPos:
        },
        
        yAxis:{
            range:[],
            yAxisIndex,
            keyTicks:[] || function(){}
            nice:true
        }
        series:[{
            range:[0,400],
            data:[],
            key: `id`,
            type,
            style
        },{
            range:[400,600]
            data:[],
            key:`id`
        }]
    })
    
    
    