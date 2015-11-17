import TrendCreator from './TrendCreator.js'
import KLineCreator from './KLineCreator.js'
import HsDataFactoryList from 'hs-public'
//import _FCharts from '../src/index.js'

//import _HsDataFactoryList from 'hs-public'
//
//const  ChartExtends = {
//    createTrend,
//    FCharts:FCharts,
//    configTokenUrl(tokenUrl){
//        HsDataFactoryList.configTokenServer({
//            tokenUrl
//        })
//    }
//}

class ChartExtends{
    constructor(FCharts,HsDataFactoryList){
        //this.FCharts = FCharts || _FCharts;
        //this.HsDataFactoryList = HsDataFactoryList|| _HsDataFactoryList;
        this.FCharts = FCharts
        this.HsDataFactoryList = HsDataFactoryList;
        this.TrendCreator = function(options){
            return new TrendCreator(this.FCharts,this.HsDataFactoryList,options)
        }
        this.KLineCreator = function(options){
            return new KLineCreator(this.FCharts,this.HsDataFactoryList,options)
        }
    }
}


export default  ChartExtends;