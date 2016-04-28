'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var AnalysisIndexView = React.createClass({
    render:function(){
        return (<ContentContainer>
                        <ToolBar title="学习曲线" subtitle="" actions={[]}></ToolBar>
                        <View>
								<Text>{"This is 'HomeWork Topic Details Page'"}</Text>		
						</View>   
                        <TabBars name="/analysis/index"></TabBars>
                </ContentContainer>)
    }
})

module.exports = AnalysisIndexView;