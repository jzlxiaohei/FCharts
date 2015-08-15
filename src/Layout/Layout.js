import DrawComponent from '../DrawComponent/DrawComponent.js'

import ComponentFactory from '../DrawComponent/Factory.js'

class Layout{
    constructor(options={}) {
        this.ctx = options.ctx;
        this.xBridge = options.xBridge;
        this.cmptList = {}//{key:{}}
    }

    setCtx(ctx){
        this.ctx = ctx;
        return this;
    }


    addComponent(key,componentType,yBridge){
        //var drawComponent = new DrawComponent();
        var drawComponent =ComponentFactory(componentType)
        drawComponent
            .setCtx(this.ctx)
            .setXBridge(this.xBridge)
            .setYBridge(yBridge)

        this.cmptList[key]= drawComponent;
        return this;
    }

    getComponent(key){
        return this.cmptList[key];
    }


    setXBridge(xBridge){
        this.xBridge = xBridge;
        return this;
    }

    render(){
        let viewRange = this.xBridge.getViewRange();
        const cmptList = this.cmptList;

        for(let i in cmptList){
            cmptList[i].setViewRange(viewRange)
            cmptList[i].render();
        }
    }



    //scale 缩放的比例，value 在那一点进行缩放（这里一般是x轴上一个坐标点）
    setScale(scale,value){
        this.xBridge.setScale(scale,value)

    }

    setTranslation(x){
        this.xBridge.setTranslation(x);

    }

    getInfoByX(xValue) {
        var index = this.xBridge.getIndexByValue(xValue);

        //var xAxis = this.xBridge.getXAxis();
        //yAxis = this.yBridge.getYAxis();

        var tipInfo = {
            x: this.xBridge.getDataByIndex(index)
        }

        for (var i in this.cmptList) {
            var yBridge = this.cmptList[i].getYBridge()
            tipInfo[i] = yBridge.getDataByIndex(index)
        }
        return tipInfo;
    }
}

export default Layout;
