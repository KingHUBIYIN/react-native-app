'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
	StyleSheet,
	Image,
	Animated
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ToggleButton} = require('../base/react-native-form');
var {ContentContainer,RowContainer,WebImage,Splitter} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
var ColorUtils = require('../../utils/color-utils');

var btn_drop_down = require('../../images/btn_drop_down.png');
var btn_drop_up = require('../../images/btn_drop_up.png');

var UserHelpView = React.createClass({
	getInitialState:function(){
		return {
			toggle_form:{},
			animate_form:{}
		}
	},
	onNavIconPress:function(){
		History.popRoute();
	},
	onHelpIconPress:function(e,name,toggle){
		var toggle_form = this.state.toggle_form;
		toggle_form[name] = toggle;
		this.setState({
			toggle_form:toggle_form,
			toggle_name:name
		})
	},
	genHelpRow:function(name,title){
		return (<View style={styles.view}>
						<Text style={[styles.title,ColorUtils.text2]}>{title}</Text>
						<View style={styles.textRow}>
						</View>
						<ToggleButton name={name} icon={btn_drop_down} toggleIcon={btn_drop_up} style={styles.next} iconHeight={Dimensions.size["8"]} iconWidth={Dimensions.size["8"]} onPress={this.onHelpIconPress}/>
					</View>)
	},
	genHelpDetailsRow:function(name,content){
		var toggle_form = this.state.toggle_form;
		var animate_form = this.state.animate_form;
		var toggle = toggle_form[name];
		var animate = animate_form[name];
		var toggle_name = this.state.toggle_name;
		if(toggle_name==name){
			if(toggle) {
				animate = new Animated.Value(0.01)
				Animated.timing(animate,{toValue:Dimensions.size["64"]}).start();
			}else{
				animate = new Animated.Value(Dimensions.size["64"])
				Animated.timing(animate,{toValue:0.01}).start();
			}
		}else{
			animate = toggle? Dimensions.size["64"] : 0.01;
		}

		return  (
			<Animated.View  collapsable={false} style={{"height":animate,"overflow":"hidden"}}>
				<View style={styles.viewDetails}>
					<Text>{content}</Text>
			   </View>
			</Animated.View>)
	},
    render:function(){
		var password = this.genHelpRow("password","密码");
		var homework = this.genHelpRow("homework","作业");
		var analysis = this.genHelpRow("analysis","分析");
		var wrongbook = this.genHelpRow("wrongbook","错题本");
		var other = this.genHelpRow("other","其他");
		
		var passwordDetails = this.genHelpDetailsRow("password","帮助的详细信息");
		var homeworkDetails = this.genHelpDetailsRow("homework","帮助的详细信息");
		var analysisDetails = this.genHelpDetailsRow("analysis","帮助的详细信息");
		var wrongbookDetails = this.genHelpDetailsRow("wrongbook","帮助的详细信息");
		var otherDetails = this.genHelpDetailsRow("other","帮助的详细信息");
			
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<我"}}  title="帮助" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <RowContainer style={styles.row}>
								{password}
								{passwordDetails}
								<Splitter style={styles.splitter}/>
								{homework}
								{homeworkDetails}
								<Splitter style={styles.splitter}/>
								{analysis}
								{analysisDetails}
								<Splitter style={styles.splitter}/>
								{wrongbook}
								{wrongbookDetails}
								<Splitter style={styles.splitter}/>
								{other}
								{otherDetails}
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
		height:Dimensions.size["8"],
		paddingHorizontal:Dimensions.size["0"]
	},
	viewDetails:{
		paddingTop:Dimensions.size["5"],
		marginBottom:Dimensions.size["5"],
		marginHorizontal:Dimensions.size["10"],
		flexDirection:"row",
		justifyContent:"flex-start",
		alignItems:"center",
		borderTopColor:"#d8d8d8",
		borderStyle:"solid",
		borderTopWidth:1
	}
})
	
module.exports = UserHelpView;