'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
	StyleSheet,
	Image
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer,WebImage,Splitter} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
var ColorUtils = require('../../utils/color-utils');

var btn_next_normal = require('../../images/btn_next_normal.png');

var HomeListView = React.createClass({
	onNavIconPress:function(){
		History.popRoute();
	},
    render:function(){
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<我"}}  title="设置" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <RowContainer style={styles.row}>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>修改密码</Text>
									<View style={styles.textRow}>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>意见反馈</Text>
									<View style={styles.textRow}>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>版本更新</Text>
									<View style={styles.textRow}>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>清除缓存</Text>
									<View style={styles.textRow}>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
							</RowContainer> 
							<RowContainer style={styles.row}>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>关于我们</Text>
									<View style={styles.textRow}></View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
						</RowContainer>   
                </ContentContainer>)
    }
})
		
var styles = StyleSheet.create({
	textRow:{
		width:Dimensions.screenWidth - Dimensions.size["60"],
		flexDirection:"row",
		justifyContent:"flex-end",
		alignItems:"center"
	},
	avatar:{
		width:Dimensions.size["30"],
		height:Dimensions.size["30"],
	},
	row:{
		marginTop:Dimensions.size["5"]
	},
	title:{
		fontSize:Dimensions.size["7"],
		width:Dimensions.size["30"]
	},
	text:{
		fontSize:Dimensions.size["5"]
	},
	view:{
		paddingVertical:Dimensions.size["5"],
		paddingHorizontal:Dimensions.size["10"],
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center"
	},
	splitter:{
		width:Dimensions.screenWidth-Dimensions.size["20"],
		marginHorizontal:Dimensions.size["10"],
	},
	next:{
		width:Dimensions.size["8"],
		height:Dimensions.size["8"]
	},
})
	
module.exports = HomeListView;