import LinearScale from './LinearScale.js'
import TimeScale from './TimeScale.js'


var toString = Object.prototype.toString;

var utils = {

}
utils.Type ={
    isArray(arr){return toString.call(arr) == '[object Array]'},
    isFunction(fn){return toString.call(fn) == '[object Function]'}
}

utils.String={
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

utils.Common = {
    merge(target,source,isOverwrite){
        for(var i in source){
            if(i in target){
                if(isOverwrite){
                    target[i] = source[i];
                }
            }else{
                target[i] = source[i];
            }
        }
        return target
    },
    //[[k1,v1],[k2,v2]] =>{ k1:v1,k2:v2}
    //k1,
    makeKvObj(kvArr){
        var kvObj = {}
        for(var i =0;i<kvArr.length;i++){
            var kv = kvArr[i]
            kvObj[kv[0]] = kv[1];
        }
        return kvObj;
    },

    invertKv(kvObj){
        var vkObj={}
        for(var i in kvObj){
            vkObj[kvObj[i]] = i
        }
        return vkObj;
    },

    generateGetterSetter(obj,properties){
        for(var i in properties){
            var p = utils.String.capitalizeFirstLetter(i);
            var v = properties[i];
            (function(prop,value) {
                obj[prop] = value;
                obj['get' + prop] = function () {
                    return obj[prop];
                }
                obj['set' + prop] = function(v){
                    obj[prop] = v;
                    return obj;
                }
            })(p,v)
        }
    }
}

utils.Array={
    push(originArr,item){
        if(utils.isArray(item)){
            for(var i =0;i<item.length;i++){
                originArr.push(item[i])
            }
        }else{
            originArr.push(item);
        }
    },
    unshift(originArr,item){
        if(utils.isArray(item)){
            for(var i =0;i<item.length;i++){
                originArr.unshift(item[i])
            }
        }else{
            originArr.unshift(item);
        }
    }
}


utils.Math={
    LineScale:function(domain,range){
        return new LinearScale({domain:domain,range:range});
    },
    TimeScale:function(domain,range){
        return new TimeScale({
            domain:domain,
            range:range
        });
    },
    //@see http://stackoverflow.com/questions/4228356/integer-division-in-javascript
    integerDivide(a,b){
        return {
            div:Math.floor(a / b),
            rem:a % b
        }
    }
}


utils.Canvas={
    fillTextCenter(ctx,text,x,y){
        var textWidth =  ctx.measureText(this.textFormat).width;
        ctx.fillText(text,x-textWidth/2,y)
        return textWidth
    },
    wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars = text.split("\n");

        for (var ii = 0; ii < cars.length; ii++) {

            var line = "";
            var words = cars[ii].split(" ");

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + " ";
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y);
            y += lineHeight;
        }
    },
    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
}


utils.Fn={
    noop:function(){},
    identify:function(e){return e}
}

var defaultBinarySearchCompareFunc=function(target,curElem) {
    if(curElem < target){
        //return 'less';
        return -1
    }else if(curElem > target){
        //return 'more';
        return 1
    }else{
        //return 'equal'
        return 0
    }
}

utils.Algorithms={
    binarySearch(arr,value,compareFunc){
        compareFunc = compareFunc || defaultBinarySearchCompareFunc
        var minIndex = 0;
        var maxIndex = arr.length - 1;
        var currentIndex;
        var currentElement;
        while (minIndex <= maxIndex) {
            currentIndex = Math.floor( (minIndex + maxIndex) / 2 );
            currentElement = arr[currentIndex];
            //less more equal
            var lme = compareFunc(value,currentElement)

            if(lme < 0) {
                minIndex = currentIndex+1;
            }else if(lme > 0){
                maxIndex = currentIndex-1;
            }else {
                return currentIndex;
            }
        }
        return -1;
    }
}
export default utils;