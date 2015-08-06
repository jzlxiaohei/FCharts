class NiceTickScale{
    constructor(options){
        this.min = options.min;
        this.max = options.max;
        this.maxTicks = options.maxTicks || 10;
        this._calculate();
    }


    _calculate(){
        var max = this.max,
            min = this.min
        var maxTicks = this.maxTicks;
        this.range = this._niceNum(max-min,false);

        var tickSpacing = this.tickSpacing = this._niceNum(this.range / (maxTicks - 1), true);
        this.niceMin =
            Math.floor(min / tickSpacing) * tickSpacing;
        this.niceMax =
            Math.ceil(max / tickSpacing) * tickSpacing;
    }

    _niceNum(range,isRound){
        var exponent = Math.floor(Math.log10(range)),
            fraction = range / Math.pow(10, exponent)
            ,niceFraction;

        if (isRound) {
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

    getNiceRange(){
        return [this.niceMin,this.niceMax];
    }

    getTickSpacing(){
        return this.tickSpacing;
    }
}

export default NiceTickScale
