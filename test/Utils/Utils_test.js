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

        describe('merge',function(){
            it('merge',function(){
                var merge = Utils.Common.merge
                var obj = {}
                var objRet = merge(obj,{a:1,b:2});
                should(objRet).eql({a:1,b:2}).and.exactly(obj)
            })

            it('merge without overwrite',function(){
                var merge = Utils.Common.merge
                var obj = {a:1,b:2}
                merge(obj,{a:100,c:3})
                should(obj).eql({
                    a:1,
                    b:2,
                    c:3
                })
            })

            it('merge with overwrite',function(){
                var merge = Utils.Common.merge
                var obj = {a:1,b:2}
                merge(obj,{a:100,c:3},true)
                should(obj).eql({
                    a:100,
                    b:2,
                    c:3
                })
            })

            it('merge: just shalow copy',function(){
                var merge = Utils.Common.merge
                var source={
                    p1:{a:1}
                }
                var target = {}
                merge(target,source)
                should(target.p1).be.exactly(source.p1)
            })
        })

        describe('makeKvObj',function(){
            it('simple',function(){
                var kvArr = [
                    ['a',1],
                    ['b',2]
                ]
                var kvObj = Utils.Common.makeKvObj(kvArr);
                should(kvObj).be.eql({
                    a:1,b:2
                })
            })

            it('same k will be overwrite',function(){
                var kvArr = [
                    ['a',1],
                    ['b',2],
                    ['a',3]
                ]
                var kvObj = Utils.Common.makeKvObj(kvArr);
                should(kvObj).be.eql({
                    a:3,b:2
                })
            })
        })

        describe('Math',function(){
            it('integerDivide',function(){
                var intDivObj = Utils.Math.integerDivide(10,3)
                should(intDivObj).be.eql({
                    rem:1,
                    div:3
                })
            })

            it('LineScale : see more is LinearScale test',function(){
                var a = Utils.Math.LineScale()
                var b = Utils.Math.LineScale()
                should(a).not.be.exactly(b)
            })
        })

        describe('Algorithms',function(){
            it('BinarySearch with number',function(){
                var nums = [1,4,9,16,33,55,68,79,95,100]
                var bs = Utils.Algorithms.binarySearch
                should(bs(nums,55)).be.exactly(5)
                should(bs(nums,88)).be.exactly(-1)
                should(bs(nums,1)).be.exactly(0)
                should(bs(nums,100)).be.exactly(nums.length-1)
            })

            it('BinarySearch with other type',function(){

            })

        })

        describe('Fn',function(){
            it('identify',function(){
                var idFunc = Utils.Fn.identify
                var obj={};

                should(idFunc(obj)).be.exactly(obj)
                should(idFunc(1)).be.exactly(1)
                should(idFunc(true)).be.exactly(true)
                should(idFunc("test")).be.exactly('test')
            })
        })
    })
})
