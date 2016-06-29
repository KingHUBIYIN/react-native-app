'use strict'
var React = require('react');
var {
   Text,
    View,
    ListView,
    ScrollView,
    Navigator,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Alert,
    WebView
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {ToggleButton,RadioSelect} = require('../base/react-native-form');
var WebAPIUtils = require('../../utils/web-api-utils')

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
//图片资源
var ico_subject = require("../../images/ico_chinese.png");

var HomeListView = React.createClass({
    onNavIconPress:function(){
		History.popRoute();
	},
    _onCaptureAgain:function(){
        History.pushRoute("/wrong/practice/"+this.props.topic_id);
    },
    render:function(){
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title="练习报告" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View style = {styles.blank}></View>
                        <RowContainer>
                            <View style = {styles.titleTop}><Text style = {styles.fontStyle}>答案结果</Text></View>
                            <View style = {styles.num}>
                                <View style = {styles.numStyle}><Text style = {[styles.fontStyle,styles.fontColor]}>1</Text></View>
                                <View style = {styles.numStyle}><Text style = {[styles.fontStyle,styles.fontColor]}>2</Text></View>
                                <View style = {styles.numStyle}><Text style = {[styles.fontStyle,styles.fontColor]}>3</Text></View>
                            </View>
                            <View style = {styles.black1}></View>
                            <View style = {styles.Images}><Image source = {ico_subject} style = {styles.Img} /></View>
                        </RowContainer>
                        <View style = {styles.footer}>
                             <TouchableOpacity onPress = {this._onCaptureAgain}>
                                    <View style = {[styles.footborder,styles.footWidth]}><Text style = {styles.footSize}>再次攻克</Text></View>
                             </TouchableOpacity>
                             <TouchableOpacity onPress = {this._onQueryErrorTopics}>
                                    <View style = {styles.footWidth}><Text style = {styles.footSize}>查看错题</Text></View>
                             </TouchableOpacity>
                        </View>
                </ContentContainer>)
    }
});
        
var styles = StyleSheet.create({
    blank:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["5"]
    },
    black1:{
        width: Dimensions.screenWidth,
        height:1,
        paddingLeft: Dimensions.size["2"],
        paddingRight: Dimensions.size["2"],
        backgroundColor:"#ddd"
    },
    titleTop:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["25"],
        paddingLeft: Dimensions.size["10"],
        paddingRight: Dimensions.size["10"],
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    num:{
        paddingLeft: Dimensions.size["25"],
        paddingRight: Dimensions.size["25"],
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    numStyle:{
        width: Dimensions.size["15"],
        height: Dimensions.size["15"],
        marginRight: Dimensions.size["2"],
        marginBottom: Dimensions.size["10"],
        backgroundColor: "blue",
        borderRadius: Dimensions.size["12"],
        justifyContent: "center",
    },
    Images:{
        paddingTop: Dimensions.size["4"],
        paddingBottom: Dimensions.size["4"],
        paddingLeft: Dimensions.size["10"],
        paddingRight: Dimensions.size["10"],
    },
    Img:{
        width: Dimensions.screenWidth-Dimensions.size["20"],
        height: Dimensions.size["80"]
    },
    fontStyle:{
        fontSize: Dimensions.size["7"],
        textAlign: "center"
    },
    fontColor:{
        color: "#fff"
    },
    footer:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["25"],
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
    },
    footWidth:{
        width: Dimensions.screenWidth / 2,
        height: Dimensions.size["18"],
        justifyContent: "center"
    },
    footborder:{
        borderStyle:"solid",
        borderRightColor: "#EDEDED",
        borderRightWidth: 1
    },
    footSize:{
        fontSize: Dimensions.size["7"],
        fontWeight: "bold",
        color: "#232323",
        textAlign:"center"
    }
})

module.exports = HomeListView;