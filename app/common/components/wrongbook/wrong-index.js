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

var HomeListView = React.createClass({
    render:function(){
        return (<ContentContainer>
                        <ToolBar title="错题本"></ToolBar>
                        <View>
								<Text>{"This is 'Wrongbook Index Page'"}</Text>		
						</View>   
                        <TabBars name="/wrong/index"></TabBars>
                </ContentContainer>)
    }
})

module.exports = HomeListView;