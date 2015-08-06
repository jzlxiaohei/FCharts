class TickScale{
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
        this.tickSpacing = (max-min)/(maxTicks-1);
    }


    getTickSpacing(){
        return this.tickSpacing;
    }
}

export default TickScale
