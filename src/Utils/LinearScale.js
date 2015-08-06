import Utils from '../Utils/Utils.js';


function niceNum(rangeLen,round){
    var exponent = Math.floor(Math.log10(rangeLen)),
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

    constructor(options) {
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
        //console.log(this.range)
        return this.linear(this.domain, this.range, value);
        //var [x1,x2] = this.domain,
        //    [y1,y2] = this.range;
        //
        //var yLen = y2-y1,
        //    xLen = x2-x1;
        //
        //return (value-x1)*yLen/xLen + y1;
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

    _avgTick(count){
        var [min,max] = this.range;
        var step =  (max-min)/(count-1) ;
        if(step<=0){
            throw new Error('tick step <=0,it will lead endless loop')
        }
        return{
            start:min,
            end:max,
            step:step
        }
    }

    /**
     * @see http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
     *
     */

    _niceTick(count){
        var [min,max] = this.range;
        var maxTicks = count;

        var niceRangeLen = niceNum(max-min,false);

        var tickSpacing = niceNum(niceRangeLen / (maxTicks - 1), true);
        var niceMin =
            Math.floor(min / tickSpacing) * tickSpacing;
        var niceMax =
            Math.ceil(max / tickSpacing) * tickSpacing;

        return {
            start:niceMin,
            end:niceMax,
            step:tickSpacing
        }
    }
}