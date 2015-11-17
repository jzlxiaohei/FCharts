import Utils from '../Utils/Utils.js';


function niceNum(rangeLen,round){
    var exponent = Math.floor(Math.log(rangeLen)/Math.LN10),
        fraction = rangeLen / Math.pow(10, exponent)
        ,niceFraction;

    if (round) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}



export default class Linear {

    constructor(options={}) {
        this.domain = options.domain || [0, 1];
        this.range = options.range || [0, 1];
    }

    setRange(range){
        this.range = range;
        return this;
    }

    setDomain(domain){
        this.domain = domain
        return this;
    }

    linear(a, b, value) {
        var t = (value - a[0]) / (a[1] - a[0]);
        return b[0] * (1 - t) + b[1] * t;
    }

    scale(value) {
        return this.linear(this.domain, this.range, value);
    }

    invert(value) {
        return this.linear(this.range, this.domain, value);
    }

    ticks(count = 10,nice=false) {
        if(nice){
            return this._niceTick(count)
        }else{
            return this._avgTick(count)
        }
    }

    _avgTick(count,withBound=true){
        var [min,max] = this.domain;

        if(max<=min) return [];

        var step =  (max-min)/(count-1) ;


        //var start = Math.floor(min*step/step),
        //    end =Math.ceil(max*step/step),
        //    step = step

        var ticks = []

        //if(start != min){
        //    ticks.push(start)
        //}

        for(var i = min;i<=max;i+=step){
            ticks.push(i)
        }
        //if(end!=max){
        //    ticks.push(end);
        //}

        return ticks;
    }

    /**
     * @see http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
     *
     */
    _niceTick(count){

        var [min,max] = this.domain;

        if(max<=min) return [];

        var maxTicks = count;

        var niceRangeLen = niceNum(max-min,false);

        var tickSpacing = niceNum(niceRangeLen / (maxTicks - 1), true);
        var niceMin =
            Math.floor(min / tickSpacing) * tickSpacing;
        var niceMax =
            Math.ceil(max / tickSpacing) * tickSpacing;


        var start=niceMin,
            end  =niceMax,
            step =tickSpacing

        var ticks = []
        for(var i = start;i<end;i+=step){
            ticks.push(i)
        }
        return ticks;

    }
}