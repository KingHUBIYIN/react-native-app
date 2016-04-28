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
	onNavIconPress:function(){
		History.popRoute();
	},
    render:function(){
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<我"}} title="帮助" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View>
								<Text>{"This is 'HomeWork Topic Details Page'"}</Text>		
						</View>   
                </ContentContainer>)
    }
})

module.exports = HomeListView;