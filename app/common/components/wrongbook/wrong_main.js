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
    Alert
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');


var WrongMain = React.createClass({
    render:function(){
        return (
            <ScrollView style = {styles.listview}>
                <View style = {styles.allTitle}>
                    <View style = {styles.topicType}><Text style = {styles.textSize}>全部</Text></View>
                    <View><Text style = {styles.textSize}>选择题</Text></View>
                    <View><Text style = {styles.textSize}>填空题</Text></View>
                    <View><Text style = {styles.textSize}>解答题</Text></View>
                </View>
                <View><Text>This is wrong_main_list</Text></View>
         </ScrollView>
        )
    }
});
        
    
var styles = StyleSheet.create({
    allTitle:{
         height: Dimensions.size["25"],
         flexDirection:"row",
         alignItems:"center",
         justifyContent:"space-between",
         borderStyle:"solid",
         borderBottomWidth: 1,
         borderBottomColor: "#D8D8D8"
    },
    topicType:{
        width: Dimensions.size["27"],
        height: Dimensions.size["11"],
        backgroundColor: "#74C93C",
        borderRadius: 2
    },
    textSize:{
        fontSize: Dimensions.size["7"]
    },
    listview:{
        height: Dimensions.screenHeight - Dimensions.toolBarHeight - Dimensions.size["25"]
    },
    answerList:{
        height: Dimensions.size["20"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start",
        borderStyle:"solid",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D8D8"
    }
});

module.exports = WrongMain;