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

    ticks(count = 10,nice=false,useRange=true) {
        if(nice){
            return this._niceTick(count,useRange)
        }else{
            return this._avgTick(count,useRange)
        }
    }

    _avgTick(count,useRange){
        if(useRange){
            var [min,max] = this.range;
            if(min > max){
                [min,max] = [max,min];
            }
        }else{
            var [min,max] = this.domain;
        }
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
    _niceTick(count,useRange){
        if(useRange){
            var [min,max] = this.range;
            if(min > max){
                [min,max] = [max,min];
            }
        }else{
            var [min,max] = this.domain;
        }
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