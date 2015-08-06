import DrawComponent from '../DrawComponent/DrawComponent.js'

class Layout{
    constructor() {
        this.cmptList = {}//{key:{}}
    }

    addComponent(key,painter,yBridge){
        var drawComponent = new DrawComponent();
        drawComponent.setPainter(painter)
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
        const cmptList = this.cmptList;
        for(let i in cmptList){
            cmptList[i].render();
        }
    }

    //scale 缩放的比例，value 在那一点进行缩放（这里一般是x轴上一个坐标点）
    setScale(scale,value){
        this.xBridge.setScale(scale,value)
        //let viewRange = this.xBridge.getViewRange();
        //const cmptList = this.cmptList;
        //for(let i in cmptList) {
        //    cmptList[i].setViewRange(viewRange)
        //}
    }

    setTranslation(x){
        this.xBridge.setTranslation(x);
        //let viewRange = this.xBridge.getViewRange();
        //const cmptList = this.cmptList;
        //for(let i in cmptList) {
        //    cmptList[i].setViewRange(viewRange)
        //}
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
