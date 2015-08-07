/**
 * Created by zilong on 6/23/15.
 */
var toString = Object.prototype.toString;

var utils = {

}
utils.Type ={
    isArray(arr){return toString.call(arr) == '[object Array]'},
    isFunction(fn){return toString.call(fn) == '[object Function]'}
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
    makeKvObj(kvArr){
        var kvObj = {}
        for(var i =0;i<kvArr.length;i++){
            var kv = kvArr[i]
            kvObj[kv[0]] = kv[1];
        }
        return kvObj;
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

import LinearScale from './LinearScale.js'
utils.Math={
    LineScale:function(domain,range){
            return new LinearScale({domain:domain,range:range});
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

}


utils.Fn={
    noop:function(){},
    identify:function(e){return e}
}

var defaultBinarySearchCompareFunc=function(target,curElem) {
    if(curElem < target){
        return 'less';
    }else if(curElem > target){
        return 'more';
    }else{
        return 'equal'
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

            if(lme == 'less') {
                minIndex = currentIndex+1;
            }else if(lme =='more'){
                maxIndex = currentIndex-1;
            }else {
                return currentIndex;
            }

            //if (currentElement < value) {
            //    minIndex = currentIndex + 1;
            //}
            //else if (currentElement > value) {
            //    maxIndex = currentIndex - 1;
            //}
            //else {
            //    return currentIndex;
            //}
        }
        return -1;
    }
}
export default utils;