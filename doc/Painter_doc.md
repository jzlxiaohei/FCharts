#PainterBase ：
    
###Properties:
    
1.xRange:x方向的作图范围，必须 
  yRange:y方向的作图范围，必须
        
2.xAxis,yAxis:坐标的x和y，第一个点就是{xAxis[0],xAxis[1]},要求xArr.length >= yAxis.length,必须
        
3.style:作图的样式，有默认值
  
  strokeStyle,fillStyle(标准canvas属性)，如果没设置，color设置， 会设置成color
   
  brushType:stroke,fill or both
            
4.ctx:canvas的2D context,必须
        
        
        
###Methods:
 
1.setter methods for properties
        
2.beforeDraw,draw,afterDraw:
   
 beforeDraw:画之前，保存canvas状态之类的操作（可能的功能，beginPath,clip,save stack status）
 
 draw: 根据xAxis和yAxis去画图
 
 afterDraw: 应用样式
            
 	其中：beforeDraw和afterDraw在PainterBase中有默认实现，一般不需要改写
            
   	继承PainterBase的子类，必须实现自己draw方法
            
   	render:依次调用beforeDraw,draw,afterDraw,使用painter的时候，都应该使用render方法
        （特别情况下，子类可以直接改写render方法，见AreaPainter）
    
---
  
#LinePainter:
    
 afterDraw里增加了对setLineDash的检测
    
#CandlePainter:
 style里增加了itemWidth，既一个candle的宽度
    
#AreaPainter:
 完全重写了render，因为有stroke和fill 两次画图操作(暂为做任何测试 2015.08.19)