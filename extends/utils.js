function deepmerge(target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function(e, i) {
            if (typeof dst[i] === 'undefined') {
                dst[i] = e;
            } else if (typeof e === 'object') {
                dst[i] = deepmerge(target[i], e);
            } else {
                if (target.indexOf(e) === -1) {
                    dst.push(e);
                }
            }
        });
    } else {
        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            })
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key];
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = deepmerge(target[key], src[key]);
                }
            }
        });
    }
    return dst;
}

const util={
    deepmerge,
    dateStr2Obj(str){
        str = str+''
        var year = +str.substring(0,4),
            mouth = +str.substring(4,6),
            day = +str.substring(6,8),
            hour = +str.substring(8,10),
            minute = +str.substring(10,12)
        return new Date(year,mouth-1,day,hour,minute)
    },
    keyValueInvert(kvObj){
        var vkObj={}
        for(var i in kvObj){
            vkObj[kvObj[i]] = i;
        }
        return vkObj;
    },

    createDom(domId,options){
        const parentDom = document.getElementById(domId)

        if(!parentDom){throw new Error(`cannot get dom by id ${domId}  must be set in options`)}

        const canvasWidth = options.width || parentDom.offsetWidth,
            canvasHeight = options.height || canvasWidth*0.618;


        const canvasId= domId +'-canvas',
            canvasEventId = domId+'-event-canvas'

        const canvasHtml= `
        <canvas id="${canvasId}" width="${canvasWidth}" height="${canvasHeight}" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
        <canvas id="${canvasEventId}" width="${canvasWidth}" height="${canvasHeight}" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
        `

        parentDom.innerHTML=canvasHtml
        parentDom.style['height']=canvasHeight+'px'
        return {
            canvasHeight,
            canvasWidth,
            canvasId,
            canvasEventId
        }
    }
}

export default util