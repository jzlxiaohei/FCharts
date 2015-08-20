#整体说明

之前数据和Painter是直接对接的，后来发现，每个Paitner都有一些特殊的地方，很难统一。所以在数据和Painter中加了一层，`DrawComponent`

`DrawComponet`一边对接`DataBridge`,一边对接`Painter`(Painters)。

#BaseDrawComponent

Properties:

	ctx
	xBridge
	yBridge
	xTickOn
	yTickOn
	xTextFormat
	yTextFormat
	
Methods:

1.Setters

2.`beforeDraw`,`draw`,`afterDraw`

3.render: 外部调用用，依次调用beforeDraw,draw,afterDraw; 子类一般需要改写draw方法，来实现具体的作图逻辑，如果默认的beforeDraw,draw,afterDraw流程没法满足要求，可以直接改写render

4.drawGrid：画坐标轴的网格，ticks，和tickLabel。x轴是时间序列，y轴是线性数值序列。目前这块写的比较死，考虑怎么可配置化

#CandleComponent

override了`BaseDrawComponent`的draw方法，主要是把分成了上涨的蜡烛`upCandlePainter`,和下跌的蜡烛`downCandlePainter`

#LineDrawComponent
作图部分很简单，有个问题：数据可以为`ohlc`这样的object，或者纯数值，所以当数据为`ohlc`时，要选一个属性。

#AreaDrawComponent
