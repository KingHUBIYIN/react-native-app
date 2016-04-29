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
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer,Splitter} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {TextInput,Button} = require('../base/react-native-form');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var WebAPIActions = require('../../actions/web-api-actions');

var UpdatePwdView = React.createClass({
	componentDidMount:function(){
		SystemStore.addChangeListener(EventTypes.POSTED_USER_NEW_PASSWORD,this.handleSubmitSuccess);
	},
	componentWillUnmount:function(){
		SystemStore.removeChangeListener(EventTypes.POSTED_USER_NEW_PASSWORD,this.handleSubmitSuccess);
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
		Alert.alert("提示","密码修改成功，请重新登录",[{text: '确定', onPress: () => History.resetToRoute("/user/login")}]);
	},
	onSubmitPress:function(e,name){
		var form_data = this.state.form_data;
		if(!form_data.old_pwd || form_data.old_pwd==""){
            Alert.alert("提示","请输入旧密码",[{text: '确定', onPress: () => {}}]);
            return;
		}
		if(!form_data.new_pwd ||  form_data.new_pwd==""){
            Alert.alert("提示","请输入新密码",[{text: '确定', onPress: () => {}}]);
            return;
		}
		if(!form_data.confirm_pwd ||  form_data.confirm_pwd==""){
            Alert.alert("提示","请输入确认密码",[{text: '确定', onPress: () => {}}]);
            return;
		}
		if(form_data.new_pwd  != form_data.confirm_pwd){
            Alert.alert("提示","新密码与确认密码不一致",[{text: '确定', onPress: () => {}}]);
            return;
		}
		WebAPIActions.postUserNewPassword({
			"data": JSON.stringify({"old_pass":form_data.old_pwd,"new_pass":form_data.new_pwd})
		});
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
                        <ToolBar navIcon={{title:"<设置"}} title="修改密码" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <RowContainer style={styles.row}>
							<View style={styles.inputRow}>
								<TextInput name="old_pwd" placeholder="旧密码" style={styles.input} onChangeText={this.onChangeText} secureTextEntry={true} value={form_data.old_pwd} />
							</View>
						</RowContainer>   
                        <RowContainer style={styles.row}>
							<View style={styles.inputRow}>
								<TextInput name="new_pwd" placeholder="新密码" style={styles.input} onChangeText={this.onChangeText} secureTextEntry={true} value={form_data.new_pwd} />
							</View>
							<Splitter style={styles.splitter}/>
							<View style={styles.inputRow}>
								<TextInput name="confirm_pwd" placeholder="确认新密码" style={styles.input} onChangeText={this.onChangeText} secureTextEntry={true} value={form_data.confirm_pwd} />
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
		height:Dimensions.size["22"],
		paddingHorizontal:Dimensions.size["2"],
		paddingVertical:Dimensions.size["2"]
	},
	input:{
		width:Dimensions.screenWidth - Dimensions.size["4"],
		height:Dimensions.size["18"],
		fontSize:Dimensions.size["7"]
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
		backgroundColor:"#F85934",
		borderRadius:Dimensions.size["1"]
	},
	submitTitle:{
		fontSize:Dimensions.size["8"],
		lineHeight:Dimensions.size["10"],
		height:Dimensions.size["10"]
	}
})

module.exports = UpdatePwdView;