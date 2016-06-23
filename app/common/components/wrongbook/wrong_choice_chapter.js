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
var WebAPIUtils = require('../../utils/web-api-utils');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var RenderRow = React.createClass({
    handlePress:function(){
        if(this.props.onPress){
            this.props.onPress("/wrong/index/" +this.props.subject + "/WrongMain/" +this.props.rowData.answer_sheet_id)
        }
    },
    render:function(){
        var {rowData,subject,onPress,...props} = this.props;
        return(
             <TouchableHighlight underlayColor = "#D8D8D8" onPress = {this.handlePress}>
                    <View style = {styles.answerList}>
                            <Text style = {styles.textSize}>{rowData.answer_sheet.name}</Text>
                    </View>
            </TouchableHighlight>
        )
    }
});


var HomeListView = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged:(s1,s2)=>s1!==s2});
        return {
            chapter: ds.cloneWithRowsAndSections(SystemStore.getWrongTopicChapter(this.props.subject)),
            student_info:SystemStore.getSubjectByName(this.props.subject)
        }
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_EXAM_ERROR_TOPIC,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_EXAM_ERROR_TOPIC,this._onChange);
    },
    _onChange:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            chapter: ds.cloneWithRowsAndSections(SystemStore.getWrongTopicChapter(this.props.subject))
        })
    },
    _renderSectionHeader:function(sectionData, sectionID){
        return(
            <View style = {styles.header}><Text style = {styles.textSize}>{sectionID}</Text></View>
        )
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <RenderRow subject = {this.props.subject} rowData = {rowData} onPress = {this._onPushHash} />
        )
    },
    _getExamErrorTopic:function(){
        var student_info = this.state.student_info;
        var _wrong_next_cursor = SystemStore.getWrongNextCursor();
        WebAPIUtils.getExamErrorTopic({"subject_id":student_info.subject_id,"cursor":_wrong_next_cursor,"page_num":10});
    },
    _onPushHash:function(hash){
       History.pushRoute(hash);
    },
    render:function(){
        var chapter = this.state.chapter;
        return (
            <ScrollView style = {styles.listview}>
                <View style = {styles.rowContent}>
                      <View style = {styles.allTitle}><Text style = {styles.textSize}>全部章节</Text></View>
                      <ListView 
                            enableEmptySections={true} 
                            onEndReachedThreshold = {10}
                            dataSource={chapter} 
                            renderRow={this._onRenderRow}
                            renderSectionHeader={this._renderSectionHeader}
                            onEndReached = {this._getExamErrorTopic}
                            renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`}/>} 
                      />
                </View>
         </ScrollView>
        )
    }
});
        
    
var styles = StyleSheet.create({
     rowContent:{
         paddingRight: Dimensions.size["7"],
         paddingLeft: Dimensions.size["7"]
     },
    allTitle:{
         height: Dimensions.size["25"],
         flexDirection:"row",
         alignItems:"center",
         justifyContent:"flex-start",
         borderStyle:"solid",
         borderBottomWidth: 1,
         borderBottomColor: "#D8D8D8"
    },
    header:{
        height: Dimensions.size["25"],
        flexDirection:"row",
        alignItems:"center",
        borderStyle:"solid",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D8D8"
    },
    textSize:{
        fontSize: Dimensions.size["7"]
    },
    listview:{
        height: Dimensions.screenHeight - Dimensions.toolBarHeight - Dimensions.size["25"]
    },
    answerList:{
        height: Dimensions.size["20"],
        paddingLeft: Dimensions.size["7"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start",
        borderStyle:"solid",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D8D8"
    }
});

module.exports = HomeListView;