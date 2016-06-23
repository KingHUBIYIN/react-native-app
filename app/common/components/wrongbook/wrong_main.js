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
var ReactNativeWebview = require('../base/react-native-webview');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var TopicDetail = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            answers: ds.cloneWithRows(!!this.props.rowData.answers?this.props.rowData.answers:[])
        }
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <ReactNativeWebview name = {rowData} style = {styles.webViewSelsct} />
        )
    },
    handleOnpress:function(){
        if(this.props.onPress){
            this.props.onPress("/wrong/topic/"+this.props.rowData.answer_sheet_id+"/"+this.props.rowData.topic_id)
        }
    },
    render:function(){
        var {rowData,onPress,...props} = this.props;
        var answers = this.state.answers;
        if(rowData.topic_type == "1"){
             return(
                <TouchableOpacity onPress = {this.handleOnpress}>
                    <View>
                         <View style = {styles.viewContant}>
                              <ReactNativeWebview name = {rowData.content} style = {styles.webView} />
                              <ListView 
                                    enableEmptySections={true} 
                                    dataSource = {answers}
                                    renderRow = {this._onRenderRow}
                                />
                         </View>
                         <View style = {styles.blank}></View>
                    </View>
                </TouchableOpacity>
             )
        }else{
            return(
                <TouchableOpacity onPress = {this.handleOnpress} >
                    <View>
                         <View style = {styles.viewContant}>
                              <ReactNativeWebview name = {rowData.content} style = {styles.webView} />
                         </View>
                         <View style = {styles.blank}></View>
                    </View>
                </TouchableOpacity>
            )
       }
    }
});
             
var TopicType = React.createClass({
    handleOnPress:function(){
        if(this.props.onPress){
             this.props.onPress(this.props.answerSheetId,this.props.type)
        }
    },
    render:function(){
        var {type,selected,answerSheetId,content,onPress,...props} = this.props;
        var style = this.props.selected == this.props.type?styles.topicTypeColor:"";
        var styleText = this.props.selected == this.props.type?styles.textColor:"";
        return(
            <TouchableOpacity onPress = {this.handleOnPress}>
                <View style = {[styles.topicType,style]}><Text style = {[styles.textSize,styleText]}>{content}</Text></View>
            </TouchableOpacity>
        )
    }
});
             
var GroupOption = React.createClass({
     _onSelectedTopics:function(answerSheetId,type){
        if(this.props.onPress){
            this.props.onPress(answerSheetId,type);
        }
    },
     render:function(){
         var {selected,answer_sheet_id,onPress,...props} = this.props;
         return(
             <View style = {styles.topicTitle}>
                    <TopicType selected = {selected} answerSheetId = {this.props.answer_sheet_id} type = "" content = "全部" onPress = {this._onSelectedTopics} />
                    <TopicType selected = {selected} answerSheetId = {this.props.answer_sheet_id} type = "1" content = "选择题" onPress = {this._onSelectedTopics} />
                    <TopicType selected = {selected} answerSheetId = {this.props.answer_sheet_id} type = "2" content = "填空题" onPress = {this._onSelectedTopics} />
                    <TopicType selected = {selected} answerSheetId = {this.props.answer_sheet_id} type = "3" content = "解答题" onPress = {this._onSelectedTopics} />
             </View>
         )
     }
});

var WrongMain = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            wrong_topic: ds.cloneWithRows(SystemStore.getWrongTopicByType(this.props.answer_sheet_id)),
            selected: ""
        }
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <TopicDetail rowData = {rowData} onPress = {this._onTopicDetail}/>
        )
    },
    _onTopicDetail:function(hash){
         History.pushRoute(hash);
    },
    _onSelectedTopics:function(answer_sheet_id,type){
         var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
            wrong_topic: ds.cloneWithRows(SystemStore.getWrongTopicByType(answer_sheet_id,type)),
            selected: type
         })
    },
    render:function(){
        var wrong_topic = this.state.wrong_topic;
        var selected = this.state.selected;
        return (
            <ScrollView style = {styles.listview}>
                <View style = {styles.allTitle}>
                    <GroupOption selected={selected} answer_sheet_id={this.props.answer_sheet_id} onPress = {this._onSelectedTopics} />
                </View>
                <ListView 
                    enableEmptySections={true} 
                    dataSource = {wrong_topic}
                    renderRow = {this._onRenderRow}
                />
         </ScrollView>
        )
    }
});
        
    
var styles = StyleSheet.create({
    allTitle:{
         height: Dimensions.size["25"],
         borderStyle:"solid",
         borderBottomWidth: 1,
         borderBottomColor: "#D8D8D8"
    },
    topicTitle:{
        height: Dimensions.size["25"],
        paddingLeft: Dimensions.size["2"],
        paddingRight: Dimensions.size["2"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    topicType:{
        width: Dimensions.size["27"],
        height: Dimensions.size["11"],
        borderStyle:"solid",
        borderWidth: 1,
        borderColor: "#B7B7B7",
        borderRadius: 2,
    },
    topicTypeColor:{
        backgroundColor: "#74C93C",
        borderRadius: 2,
        borderWidth: 0
    },
    textSize:{
        fontSize: Dimensions.size["7"],
        textAlign: "center"
    },
    textColor:{
        color: "#fff"
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
    },
    viewContant:{
        paddingTop: Dimensions.size["4"],
        paddingLeft: Dimensions.size["4"],
        paddingRight: Dimensions.size["4"],
        paddingBottom: Dimensions.size["8"]
    },
    webView:{
        height: 200
    },
    webViewSelsct:{
        height: 50
    },
    blank:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["5"],
        backgroundColor: "#D8D8D8"
    }
});

module.exports = WrongMain;