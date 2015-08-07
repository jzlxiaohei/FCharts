import Utils from '../../src/Utils/Utils.js'

import should from 'should'

describe('Utils : ',function(){
    describe('Type:',function(){
        it('isArray',function(){
            should(Utils.Type.isArray([])).be.true
            should(Utils.Type.isArray([1,2,3])).be.true
            should(Utils.Type.isArray({0:1,1:2,length:2})).be.false
        })

        it('isFunction',function(){
            should(Utils.Type.isFunction(function(){})).be.true
            should(Utils.Type.isFunction(new Function())).be.true
            should(Utils.Type.isFunction( ()=>{})).be.true
            should(Utils.Type.isFunction([])).be.false
            should(Utils.Type.isFunction({})).be.false
        })
    })

    describe('Common',function(){
        it('merge',function(){
            var merge = Utils.Common.merge
            var obj = {}
            var objRet = merge(obj,{a:1,b:2});
            should(objRet).eql({a:1,b:2}).and.exactly(obj)
        })
    })
})
