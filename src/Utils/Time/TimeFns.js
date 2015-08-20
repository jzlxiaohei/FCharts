var TimeFns = {

};

function timeInterval(local, step, number) {

    function round(date) {
        var d0 = local(date), d1 = offset(d0, 1);
        return date - d0 < d1 - date ? d0 : d1;
    }

    function ceil(date) {
        step(date = local(new Date(date - 1)), 1);
        return date;
    }

    function offset(date, k) {
        step(date = new Date(+date), k);
        return date;
    }

    function range(t0, t1, dt) {
        var time = local(t0), times = [];
        if (dt > 1) {
            while (time < t1) {
                if (!(number(time) % dt)) times.push(new Date(+time));//可以整除
                step(time, 1);
            }
        } else {
            while (time < t1) times.push(new Date(+time)), step(time, 1);
        }
        return times;
    }

    local.floor=local;
    local.range=range;
    local.ceil = ceil;
    local.round=round;
    local.offset=offset;

    return local
}

TimeFns.second = timeInterval(function (date) {
    return new Date(Math.floor(date / 1e3) * 1e3);
}, function (date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3); // DST breaks setSeconds
}, function (date) {
    return date.getSeconds();
});

TimeFns.minute = timeInterval(function (date) {
    return new Date(Math.floor(date / 6e4) * 6e4);
}, function (date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4); // DST breaks setMinutes
}, function (date) {
    return date.getMinutes();
});

TimeFns.hour = timeInterval(function (date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new Date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
}, function (date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5); // DST breaks setHours
}, function (date) {
    return date.getHours();
});

TimeFns.day = timeInterval(function (date) {
    var day = new Date(2000, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
}, function (date, offset) {
    date.setDate(date.getDate() + offset);
}, function (date) {
    return date.getDate() - 1;
});

TimeFns.dayOfYear = function(date) {
    var year = this.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
};

TimeFns.month = timeInterval(function (date) {
    date = TimeFns.day(date);
    date.setDate(1);
    return date;
}, function (date, offset) {
    date.setMonth(date.getMonth() + offset);
}, function (date) {
    return date.getMonth();
});


TimeFns.year = timeInterval(function (date) {
    date = TimeFns.day(date);
    date.setMonth(0, 1);
    return date;
}, function (date, offset) {
    date.setFullYear(date.getFullYear() + offset);
}, function (date) {
    return date.getFullYear();
});


//TimeFns.week = timeInterval(function(date) {
//    (date = TimeFns.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
//    return date;
//}, function(date, offset) {
//    date.setDate(date.getDate() + Math.floor(offset) * 7);
//}, function(date) {
//    var day = TimeFns.year(date).getDay();
//    return Math.floor((TimeFns.dayOfYear(date) + (day + 6) % 7) / 7) - (day !== 6);
//});


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


export default  TimeFns;

