//import TimeFns from '../../../src/Utils/Time/TimeFns.js'
import TimeFns from '../../../src/Utils/Time/TimeFns.js'
import should from 'should'

//code from d3,so just simple

describe('TimeFns',function(){
    //it('1 second',function(){ testHelp(1e3)      })
    
    //it('1 minute',function(){ testHelp(60*1e3)   })
    //it('5 minute',function(){ testHelp(5*60*1e3)   })
    //it('15 minute',function(){ testHelp(15*60*1e3)   })
    //it('30 minute',function(){ testHelp(30*60*1e3)   })
    //it('1 hour',function(){ testHelp(36e5)   })//1 hour
    //it('3 hour',function(){ testHelp(108e5)   })
    //it('6 hour',function(){ testHelp(216e5)   })
    //it('12 hour',function(){ testHelp(432e5)   })
    //it('1 day',function(){ testHelp(864e5)   })
    //it('2 day',function(){ testHelp(1728e5)   })
    //it('10 day',function(){ testHelp(864e6)   })
    
    it('1 minute',function(){
        var tm = TimeFns.minute;
        var d = new Date(2000,0)
        should(tm.ceil(d).getTime() == tm.floor(d).getTime()).be.exactly(true)
        should(d.getTime() == tm.floor(d).getTime()).be.exactly(true)

        should(tm.offset(d,1).getTime() == d.getTime()+1e3*60).be.exactly(true)
        should(tm.offset(d,5).getTime() == d.getTime()+1e3*60*5).be.exactly(true)


        var d1 =new Date(d.getTime()+1)
        should(tm.round(d1).getTime() ==  tm.floor(d1).getTime()).be.exactly(true)

        var d2 =new Date(d.getTime()+1e3*60-1);
        should(tm.round(d2).getTime() ==  tm.ceil(d2).getTime()).be.exactly(true)

    })

    it('1 day',function(){
        var tm = TimeFns.day;
        var d = new Date(2000,0)
        should(tm.ceil(d).getTime() == tm.floor(d).getTime()).be.exactly(true)
        should(d.getTime() == tm.floor(d).getTime()).be.exactly(true)

        should(tm.offset(d,1).getTime() == new Date(2000,0,2).getTime()).be.exactly(true)
        should(tm.offset(d,5).getTime() == new Date(2000,0,6).getTime()).be.exactly(true)


        var d1 =new Date(d.getTime()+1)
        should(tm.round(d1).getTime() ==  tm.floor(d1).getTime()).be.exactly(true)

        var d2 =new Date(d.getTime()+1e3*60*60*24-1);
        should(tm.round(d2).getTime() ==  tm.ceil(d2).getTime()).be.exactly(true)
    })

    it('test range day',function(){
        var tm =  TimeFns.day;
        var d0 = new Date(2000,0)
        var d1 = new Date(2000,2)
        console.log(tm.range(d0,d1,20))
    })

    it('test range year',function(){
        var tm =  TimeFns.year;
        var d0 = new Date(1999,10)
        var d1 = new Date(2010,2)
        console.log(tm.range(d0,d1,1))
    })


})