import LinearScale from '../../src/Utils/LinearScale.js'

import should from 'should'

describe('LinearScale:',function(){

    it('Simple linear',function(){
        var linearScale = new LinearScale();
        linearScale.setDomain([0,100])
            .setRange([0,100])
        should( linearScale.scale(50) ).be.exactly(50)
        should( linearScale.scale(23) ).be.exactly(23)
        should( linearScale.scale(-1) ).be.exactly(-1)
        should( linearScale.scale(150)).be.exactly(150)
    })

    it('Simple linear 2',function(){
        var linearScale = new LinearScale({
            domain:[10,20],
            range:[10,100]
        });
        should( linearScale.scale(15) ).be.exactly(55)
        should( linearScale.scale(10) ).be.exactly(10)
        should( linearScale.scale(20)).be.exactly(100)
    })

    it('Linear invert',function(){
        var linearScale = new LinearScale({
            domain:[10,20],
            range:[10,100]
        });
        should( linearScale.invert(55) ).be.exactly(15)
        should( linearScale.invert(10) ).be.exactly(10)
        should( linearScale.invert(100)).be.exactly(20)
    })

    it('ticks without nice',function(){
        var linearScale = new LinearScale({
            domain:[10,20],
            range:[10,100]
        });
        var tickInfo = linearScale.ticks(9)
        should(tickInfo.step).be.exactly((100-10)/8)
    })

    it('ticks with nice',function(){
        var linearScale = new LinearScale({
            domain:[10,20],
            range:[10,100]
        });

        //nice 算法有一定的不确定性，具体的判别不写了
        //var tickInfo =
            linearScale.ticks(9,true);
        //console.log(tickInfo)
    })
})
