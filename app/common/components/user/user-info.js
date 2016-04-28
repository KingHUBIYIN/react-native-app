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

var UserInfoView = React.createClass({
	getInitialState:function(){
		return{
			student_info:SystemStore.getStudentInfo()
		}
	},
	onNavIconPress:function(){
		History.popRoute();
	},
    render:function(){
		var student_info = this.state.student_info;
		var student = student_info.student ? student_info.student : {};
		var avatar = student.avatar?student.avatar:"/static/images/iconfont-ren.png";
		var class_data = student_info.class_data?student_info.class_data : {};
		var school = student_info.school?student_info.school:{};
		
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<我" }} title="我的信息" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <RowContainer style={styles.row}>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>我的头像</Text>
									<View style={styles.textRow}>
										<WebImage src={avatar} style={styles.avatar}/>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>我的姓名</Text>
									<View style={styles.textRow}>
										<Text style={[styles.text,ColorUtils.text9]}>{student.name}</Text>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>我的学校</Text>
									<View style={styles.textRow}>
										<Text style={[styles.text,ColorUtils.text9]}>{school.name}</Text>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>我的班级</Text>
									<View style={styles.textRow}>
										<Text style={[styles.text,ColorUtils.text9]}>{class_data.create_year+"级"+class_data.class_num+"班"}</Text>
									</View>
									<Image source={btn_next_normal} style={styles.next}/>
								</View>
								<Splitter style={styles.splitter}/>
								<View style={styles.view}>
									<Text style={[styles.title,ColorUtils.text2]}>省份</Text>
									<View style={styles.textRow}>
										<Text style={[styles.text,ColorUtils.text9]}>{school.province}</Text>
									</View>
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
		paddingHorizontal:Dimensions.size["10"]
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
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center"
	},
	splitter:{
		width:Dimensions.screenWidth-Dimensions.size["24"]
	},
	next:{
		width:Dimensions.size["8"],
		height:Dimensions.size["8"]
	},
})
		

module.exports = UserInfoView;