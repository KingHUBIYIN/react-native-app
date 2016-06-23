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
            answers: ds.cloneWithRows(this.props.rowData.answers)
        }
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <ReactNativeWebview name = {rowData} style = {styles.webViewSelsct} />
        )
    },
    handleOnpress:function(){
        if(this.props.onPress){
            this.props.onPress(this.props.rowData.answer_sheet_id,this.props.rowData.no)
        }
    },
    render:function(){
        var {rowData,onPress,...props} = this.props;
        var answers = this.state.answers;
        if(rowData.topic_type == "1"){
             return(
                <TouchableOpacity onPress = {this.handleOnpress}>
                     <View style = {styles.viewContant}>
                          <ReactNativeWebview name = {rowData.content} style = {styles.webView} />
                          <ListView 
                                enableEmptySections={true} 
                                dataSource = {answers}
                                renderRow = {this._onRenderRow}
                            />
                     </View>
                     <View style = {styles.blank}></View>
                </TouchableOpacity>
             )
        }else{
            return(
                <TouchableOpacity>
                     <View style = {styles.viewContant}>
                          <ReactNativeWebview name = {rowData.content} style = {styles.webView} />
                     </View>
                     <View style = {styles.blank}></View>
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
        var {type,style,answerSheetId,content,onPress,...props} = this.props;
        return(
            <TouchableHighlight onPress = {this.handleOnPress}>
                <View style = {[styles.topicType,style]}><Text style = {styles.textSize}>{content}</Text></View>
            </TouchableHighlight>
        )
    }
});

var WrongMain = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            wrong_topic: ds.cloneWithRows(SystemStore.getWrongTopicByType(this.props.answer_sheet_id))
        }
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <TopicDetail rowData = {rowData} onPress = {this._onTopicDetail}/>
        )
    },
    _onSelectedTopics:function(answer_sheet_id,type){
         var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
            wrong_topic: ds.cloneWithRows(SystemStore.getWrongTopicByType(answer_sheet_id,type))
         })
    },
    render:function(){
        var wrong_topic = this.state.wrong_topic;
        return (
            <ScrollView style = {styles.listview}>
                <View style = {styles.allTitle}>
                    <View style = {styles.topicTitle}>
                        <TopicType style = {styles.topicTypeColor} answerSheetId = {this.props.answer_sheet_id} type = "" content = "全部" onPress = {this._onSelectedTopics} />
                        <TopicType answerSheetId = {this.props.answer_sheet_id} type = "1" content = "选择题" onPress = {this._onSelectedTopics} />
                        <TopicType answerSheetId = {this.props.answer_sheet_id} type = "2" content = "填空题" onPress = {this._onSelectedTopics} />
                        <TopicType answerSheetId = {this.props.answer_sheet_id} type = "3" content = "解答题" onPress = {this._onSelectedTopics} />
                    </View>
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

module.exports = WrongMain;