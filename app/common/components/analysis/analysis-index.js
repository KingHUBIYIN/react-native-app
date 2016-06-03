'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
	ART
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var {
	Svg,
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} = require('react-native-svg');

var AnalysisIndexView = React.createClass({
    render:function(){
        return (<ContentContainer>
                        <ToolBar title="学习曲线" subtitle="" actions={[]}></ToolBar>
                        <View>
								<Text>{"This is 'HomeWork Topic Details Page'"}</Text>		
						</View>   
						<View>
							<Svg height="100" width="100" >
								<Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green"/>
								<Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow"/>
							</Svg>
						</View>
                        <TabBars name="/analysis/index"></TabBars>
                </ContentContainer>)
    }
})

module.exports = AnalysisIndexView;