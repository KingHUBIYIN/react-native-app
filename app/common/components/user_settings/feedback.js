'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
	StyleSheet,
	Alert
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var {ContentContainer,RowContainer,Splitter} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {TextInput,Button} = require('../base/react-native-form');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var WebAPIActions = require('../../actions/web-api-actions');


var FeedBackView = React.createClass({
	componentDidMount:function(){
		SystemStore.addChangeListener(EventTypes.POSTED_USER_FEEDBACK,this.handleSubmitSuccess);
	},
	componentWillUnmount:function(){
		SystemStore.removeChangeListener(EventTypes.POSTED_USER_FEEDBACK,this.handleSubmitSuccess);
	},
	getInitialState:function(){
		return {
			form_data:{}
		}
	},
	onNavIconPress:function(){
		History.popRoute();
	},
	handleSubmitSuccess:function(){
		Alert.alert("提示","谢谢您留下的反馈意见，我们已经收到并会尽快处理！",[{text: '确定', onPress: () => History.popRoute()}]);
	},
	onSubmitPress:function(e,name){
		var form_data = this.state.form_data;
		if(!form_data.content || form_data.content==""){
            Alert.alert("提示","亲，你还没有输入要反馈的意见哟～",[{text: '确定', onPress: () => {}}]);
            return;
		}
		if(!form_data.contact ||  form_data.contact==""){
            Alert.alert("提示","亲，留下你的联系方式哇～",[{text: '确定', onPress: () => {}}]);
            return;
		}
		WebAPIActions.postUserFeedback(form_data);
	},
	onChangeText:function(name,value){
		var form_data = this.state.form_data;
		form_data[name] = value;
		this.setState({
			form_data:form_data
		})
	},
    render:function(){
		var form_data = this.state.form_data;
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<设置"}} title="意见反馈" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <RowContainer style={styles.row}>
							<View style={styles.inputRow}>
								<TextInput name="content" placeholder="用着不爽~来吐吐槽吧~" style={[styles.input,{height: Dimensions.size["64"]}]} onChangeText={this.onChangeText} value={form_data.content} multiline={true} maxLength={300}/>
							</View>
						</RowContainer>   
                        <RowContainer style={styles.row}>
							<View style={styles.inputRow}>
								<TextInput name="contact" placeholder="请留下您的联系方式 QQ/邮箱/微信" style={[styles.input,{textAlignVertical:"auto"},]} onChangeText={this.onChangeText} value={form_data.contact} maxLength={50}/>
							</View>
						</RowContainer>
						<View style={styles.submitRow}>
							<Button name="submit" title="确认提交" onPress={this.onSubmitPress} style={styles.submit} titleStyle={styles.submitTitle} textAlign="center"/>
						</View>
                </ContentContainer>)
    }
})

var styles = StyleSheet.create({
	row:{
		marginTop:Dimensions.size["5"]
	},
	inputRow:{
		width:Dimensions.screenWidth,
		paddingHorizontal:Dimensions.size["2"],
		paddingVertical:Dimensions.size["2"]
	},
	input:{
		width:Dimensions.screenWidth - Dimensions.size["4"],
		height:Dimensions.size["18"],
		fontSize:Dimensions.size["7"],
		textAlignVertical:"top"
	},
	splitter:{
		width:Dimensions.screenWidth - Dimensions.size["8"],
		marginHorizontal:Dimensions.size["4"]
	},
	submitRow:{
		width:Dimensions.screenWidth,
		height:Dimensions.size["22"],
		paddingHorizontal:Dimensions.size["2"],
		paddingVertical:Dimensions.size["2"],
		marginTop:Dimensions.size["12"]
	},
	submit:{
		width:Dimensions.screenWidth - Dimensions.size["16"],
		marginHorizontal:Dimensions.size["6"],
		height:Dimensions.size["18"],
		backgroundColor:"#74C93C",
		borderRadius:Dimensions.size["1"]
	},
	submitTitle:{
		fontSize:Dimensions.size["8"],
		lineHeight:Dimensions.size["10"],
		height:Dimensions.size["10"]
	}
})

module.exports = FeedBackView;