import TimeFns  from './Time/TimeFns.js'
import LinearScale from './LinearScale.js'

var tickMethods=[
    //ms ,fn ,offset
    [6e4,TimeFns.minute,1],    // 1-minute
    [3e5,TimeFns.minute,5],    // 5-minute
    [9e5,TimeFns.minute,15],    // 15-minute
    [18e5,TimeFns.minute,30],   // 30-minute
    [36e5,TimeFns.hour,1],   // 1-hour
    [108e5,TimeFns.hour,3],  // 3-hour
    [216e5, TimeFns.hour,6], // 6-hour
    [432e5, TimeFns.hour,12], // 12-hour
    [864e5, TimeFns.day,1],// 1-day
    [1728e5, TimeFns.day,2],// 2-day
    [864e6, TimeFns.day,10],//10 day
    [2592e6,TimeFns.month,1], // 1-month
    [7776e6,TimeFns.month,3],// 3-month
    [15552e6,TimeFns.month,6],// 3-month
    [31536e6,TimeFns.year,1] // 1-year
]


//domain 以Date形式传入
export default class TimeScale{
    constructor(options={}){
        this.domain = options.domain;
        //this.range = options.range;
    }

    //setRange(range){
    //    this.range = range;
    //    return this;
    //}

    setDomain(domain){
        this.domain = domain;
        return this;
    }

    ticks(count=10,withBound=true){
        var [bDate , eDate] = this.domain
        var span = eDate - bDate;
        var len = tickMethods.length;

        var scaleMethod,offsetValue;
        for(var i = len-1 ; i>=0 ; i--){
            var tMethods = tickMethods[i]
            var timeStep = tMethods[0];
            if( span / timeStep > count){
                scaleMethod = tMethods[1];
                offsetValue = tMethods[2];
                break;
            }
        }

        //这种情况说明 时间段太短
        if(!scaleMethod){
            scaleMethod = tickMethods[0][1];
            offsetValue = tickMethods[0][2]
        }

        var ticks =  scaleMethod.range(bDate,eDate,offsetValue);
        if(withBound && ticks.length){
            var tickLen = ticks.length;
            if(bDate.getTime()!= ticks[0].getTime()){
                ticks.unshift(bDate)
            }
            if(eDate.getTime()!=ticks[tickLen-1].getTime()){
                ticks.push(eDate)
            }
        }

        return ticks;
    }
}