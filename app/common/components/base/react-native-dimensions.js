var {Dimensions,StatusBar,Platform} = require('react-native');

var {width,scale,height,fontScale} = Dimensions.get("window");
var isIOS = Platform.OS == "ios";
var statusBarHeight = isIOS? 20: StatusBar.currentHeight;
var fontScale = scale;
if(scale>3) fontScale = 3;
module.exports = {
	get:Dimensions.get,
	screenWidth:width,
	screenHeight:height,
	screenScale:scale,
	width:width,
	height:height,
	scale:scale,
	statusBarHeight:statusBarHeight,
	toolBarHeight:16*fontScale,
	tabBarHeight:22*fontScale,
	contentHeight:height-statusBarHeight,
	getFontSize:function(size){
		return size*fontScale;// 4 6 8 12 16 24 32 48 64
	},
	getWidth:function(width){
		return width*fontScale;
	},
	getHeight:function(height){
		return height*fontScale;
	},
	size:{
		"2":2*fontScale,
		"4":4*fontScale,
		"6":6*fontScale,
		"8":8*fontScale,
		"12":12*fontScale,
		"16":16*fontScale,
		"24":24*fontScale,
		"32":32*fontScale,
		"48":48*fontScale,
		"64":64*fontScale,
	}
}