'use strict'
var React = require('react');
var {
  View,
  Text,
  StyleSheet
} = require('react-native');
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var {ContentContainer,RowContainer,Splitter} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
	
var AboutUsView = React.createClass({
	onNavIconPress:function(){
		History.popRoute()
	},
    render:function() {
        return (<ContentContainer>
				<ToolBar navIcon={{title:"<设置"}} title="关于我们" onNavIconPress={this.onNavIconPress}></ToolBar>
				<RowContainer style={styles.row}>
					<View>
						<Text>内容正在努力的组织中，请稍候！</Text>
					</View>  
				</RowContainer>
			</ContentContainer>)
    }
});
var styles = StyleSheet.create({
	row:{
		marginTop:Dimensions.size["5"]
	}
})
module.exports = AboutUsView;