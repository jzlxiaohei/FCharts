import DrawComponent from '../DrawComponent/DrawComponent.js'

import ComponentFactory from '../DrawComponent/Factory.js'

/**
 * deprecated!!!!
 */


class Layout{
    constructor(options={}) {
        this.ctx = options.ctx;
        this.xBridge = options.xBridge;
        this.componentList = {}//{key:{}}
    }

    setCtx(ctx){
        this.ctx = ctx;
        for(var i in this.componentList) {
            this.componentList[i].setCtx(ctx);
        }
        return this;
    }

    addComponent(key,componentType,yBridge){
        var drawComponent =ComponentFactory(componentType)
        drawComponent
            .setCtx(this.ctx)
            .setXBridge(this.xBridge)
            .setYBridge(yBridge)

        this.componentList[key]= drawComponent;
        return this;
    }

    getComponent(key){
        return this.componentList[key];
    }


    setXBridge(xBridge){
        this.xBridge = xBridge;
        return this;
    }

    render(){
        //let viewDomain = this.xBridge.getViewDomain();
        const componentList = this.componentList;
        for(let i in componentList){
            componentList[i].render();
        }
    }




    setScale(scale,value){
        this.xBridge.setScale(scale,value)
    }

    setTranslation(x){
        this.xBridge.setTranslation(x);
    }

    getInfoByX(xValue) {
        var index = this.xBridge.getIndexByValue(xValue);


        var tipInfo = {
            x: this.xBridge.getDataByIndex(index)
        }

        for (var i in this.componentList) {
            var yBridge = this.componentList[i].getYBridge()
            tipInfo[i] = yBridge.getDataByIndex(index)
        }
        return tipInfo;
    }
}

export default Layout;
