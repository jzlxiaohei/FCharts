#整体说明

直接给的数据，一般x为时间列表，y为数值列表。要把这些东西转化为`可以在canvas作图的数据`，另外还有得到`可视区`数据,`放大缩小`,`平移`，`计算坐标轴ticks`等功能.



#XDataBridge

关键是计算`itemWidth`

分为两种：提供`itemWidth`，提供固定长度`fixedCount`

直接提供`itemWidth`的话，直接用。提供`fixedCount`更加`range`去算出`itemWidth`

###Properties

data:原始数据

itemWidth:每个数据项的宽度

gap:每个数据项直接的间距（一个数据项所占空间（space）= itemWidth + gap）

tickCount:坐标轴ticks的个数，注意，仅仅为建议值。

scaleRange: scale的上下限

scale: 缩放比例

direction: x轴的对齐方向。如果有很多x，那么一屏放不下，一般情况，从右向左，把最近的数据展示出来。`end`表示从右向左，

xAxis: 算出来的坐标值

###Methods

initItemWidth,每个子类都要实现这个方法，做的`itemWidth`的初始化

buildAxis: 构造axis，一般需要在数据准备好以后，调用一次

setScale,setTranslations: 放大缩小平移

	每次改变xAxis，都要改变viewDomain
	
getViewDomain
	
	可视去范围。比如canvas的宽度为600,那么可视区的访问为0到600，如果x小于0或大于600，那就不用计算和绘制了。
	
getIndexByValue:
	给定canvas上的x坐标，得到相应数据的索引
	
	
getTicks:返回数据的格式：
	
	{
		domainValue : value,
		rangeValue  : value,
		index       : index
	}
	
------	
	
##YDateBridge

只会出现线性的情况。一般流程： 算出最大最小值，构造lineScale对象，对数据中的每个点，进行插值转换。

有几个小配置：
	
1.坐标轴是否对称`axisType`:`symmetry`,分时图和5日图需要

2.ohlcNameMap:其他地方的处理，都假设ohlc的数据格式为

	{
		open:val,
		close:val,
		high:val,
		low:val
	}
	
 所以如果数据不是这个格式，需要提供一个map，告知如何映射，比如
 
 	ohlcNameMap:{
          open:"open_px",
          close:"close_px",
          high : "high_px",
          low:"low_px"
    },
    
 3.tickCount,如果设置了`nickTick`为true，那么讲根据tickCount，自动去计算比较`nice`的tick; 为false，则为均分
 
 
	
