'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
    Picker,
    TextInput,
    ScrollView,
    ListView,
    StyleSheet,
    Image
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {TouchableOpacity} = require('../base/react-native-form');
var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
var SystemStore = require('../../stores/system-store');

//跳转页面
var {Route,Router,History} = require('../base/react-native-router');

//图片资源
var back_Image = require("../../images/ico_English.png");
var ico_math = require("../../images/ico_math.png");
var ico_chinese = require("../../images/ico_chinese.png");
var ico_english = require("../../images/ico_English.png");
var ico_subject = require("../../images/btn_next_normal.png");

var Subject = React.createClass({
	onPress:function(hash){
        if(this.props.onPress){
            this.props.onPress(this.props.hash);
        }
	},
	render:function(){
        var {title,style,source,hash,onPress,...props} = this.props; 
        return(
            <TouchableOpacity style = {styles.row} onPress = {this.onPress} {...props} >
                    <View>
                        <Image source={source} style = {styles.subjectImage}/>
                    </View>
                    <View style={[styles.marginRow,style]}>
                        <Text style = {styles.title}>{title}</Text>
                        <View style = {styles.textView}></View>
                        <Image source={ico_subject} style = {styles.icoSubject} />
                    </View>
            </TouchableOpacity>
        )
	}
})

var HomeIndexView = React.createClass({
    _onJumpSubject:function(hash){
        History.pushRoute(hash);
    },
    render:function(){
        var style = styles.unBorder;
        return (<ContentContainer>
                        <ToolBar  title="我的作业" ></ToolBar>
                        <ScrollView>
                            <View>
                                    <Image source={back_Image} style = {styles.backImage}/>
                            </View>
                            <RowContainer style={[styles.rowContainer,styles.ScrollView]}>
                                <Subject source = {ico_math} hash = "/home/list/math" title = "数学" onPress = {this._onJumpSubject} />
                                <Subject source = {ico_chinese} hash = "/home/list/chinese" title = "语文" onPress = {this._onJumpSubject} />
                                <Subject source = {ico_english} hash = "/home/list/english" title = "英语" style = {style} onPress = {this._onJumpSubject} />
                            </RowContainer>
                            <View style = {styles.blank}></View>
                        </ScrollView>
                        <TabBars name="/home/index"></TabBars>
                </ContentContainer>)
    }
})
        
var styles = StyleSheet.create({
    content:{
        backgroundColor:"#F6F1EB"
    },
    ScrollView:{
        flex: 1
    },
    backImage:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["64"],
        marginTop: Dimensions.size["5"]
    },
    rowContainer:{
        width: Dimensions.screenWidth,
        marginTop:Dimensions.size["5"],
        paddingLeft: Dimensions.size["6"]
    },
    row:{
        height: Dimensions.size["32"],
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center"
    },
    subjectImage:{
        width: Dimensions.size["24"],
        height: Dimensions.size["24"],
    },
    marginRow:{
        height: Dimensions.size["30"],
        marginLeft: Dimensions.size["2"],
        flexDirection:"row",
		justifyContent:"center",
		alignItems:"center",
        borderBottomColor:"#D8D8D8",
        borderStyle:"solid",
        borderBottomWidth: 1,
    },
    unBorder:{
        borderBottomColor:"#D8D8D8",
        borderStyle:"solid",
        borderBottomWidth: 0
    },
    title:{
        width:Dimensions.size["30"],
        color: "#282828",
        fontSize:Dimensions.size["7"]
    },
    textView:{
        width:Dimensions.screenWidth - Dimensions.size["76"],
		flexDirection:"row",
		justifyContent:"flex-start",
		alignItems:"center"
    },
    icoSubject:{
        marginRight:Dimensions.size["7"]
    },
    blank:{
        width:Dimensions.screenWidth,
        height: Dimensions.size["30"],
        backgroundColor: "#F6F1EB"
    }
})

module.exports = HomeIndexView;