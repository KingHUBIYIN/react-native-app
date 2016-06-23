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
    Image
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {TouchableOpacity} = require('../base/react-native-form');
var WebAPIUtils = require('../../utils/web-api-utils')

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var ico_subject = require("../../images/btn_next_normal.png");

var TouchPaperList = React.createClass({
    onTopicList:function(){
        if(this.props.onPress){
            this.props.onPress("/home/topic/"+ this.props.subject+"/"+this.props.rowData.id);
        }
    },
    render:function(){
        var {rowData,subject,onPress,...props} = this.props;
        return(
             <TouchableOpacity onPress = {this.onTopicList}>
                <View>
                     <View style = {styles.rowView}>
                            <View><Text style = {styles.paperText}>{rowData.name}</Text></View>
                            <View style = {styles.blank}></View>
                            <View><Text style = {rowData.percent > 60?styles.currayText:styles.currayTextTop}>{rowData.percent + "%"}</Text></View>
                            <Image source={ico_subject} style = {{width: 25,height: 25}} />
                     </View>
                </View>
          </TouchableOpacity>
        )
    }
})

var HomeListView = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged:(s1,s2)=>s1!==s2});
        return {
            answer_sheets: ds.cloneWithRowsAndSections(SystemStore.getAnswerSheets(this.props.subject)),
            student_info: SystemStore.getSubjectByName(this.props.subject),
            _answer_sheets:SystemStore.getAnswerSheets(this.props.subject)
        }
    },
    componentDidMount:function(){
        var _student_info = SystemStore.getSubjectByName(this.props.subject);
        WebAPIUtils.getAllData({"subject_id": _student_info.subject_id,"cursor":0,"page_num":10});
        SystemStore.addChangeListener(EventTypes.RECEIVED_ALL_DATA,this._onChange);
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_ALL_DATA,this._onChange);
        SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    _onChange:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged:(s1,s2)=>s1!==s2});
        this.setState({
             answer_sheets: ds.cloneWithRowsAndSections(SystemStore.getAnswerSheets(this.props.subject)),
             student_info: SystemStore.getSubjectByName(this.props.subject),
            _answer_sheets:SystemStore.getAnswerSheets(this.props.subject)
        })
    },
    _onGetAllData:function(){
        var next_cursor = SystemStore.getNextCursor();
        var _student_info = this.state.student_info;
        WebAPIUtils.getAllData({"subject_id": _student_info.subject_id,"cursor":next_cursor,"page_num":10});
    },
    onNavIconPress:function(){
		History.popRoute();
	},
    onJumpTopicList:function(hash){
        History.pushRoute(hash)
    },
    _renderRow:function(rowData, sectionID, rowID){
        return (
          <TouchPaperList rowData = {rowData} subject = {this.props.subject} onPress = {this.onJumpTopicList} />
        )
    },
    _renderSectionHeader:function(sectionData, sectionID){
        return(
            <View style = {styles.time}><Text style = {styles.timeText}>{sectionID}</Text></View>
        )
    },
    render:function(){
        var answer_sheets = this.state.answer_sheets;
        var student_info = this.state.student_info;
        var flagArr = [];
        var _answer_sheets = this.state._answer_sheets;
        for(var key in _answer_sheets){
            flagArr.push(_answer_sheets[key]);
        }
        if(flagArr.length > 0){
            return (
                      <ContentContainer>
                            <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                            <ListView 
                                enableEmptySections={true} 
                                onEndReachedThreshold = {10}
                                dataSource={answer_sheets} 
                                renderRow={this._renderRow}
                                renderSectionHeader={this._renderSectionHeader}
                                renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`}/>} 
                                onEndReached = {this._onGetAllData}
                            ></ListView>	
                    </ContentContainer>)
        }else{
             return(
                <ContentContainer>
                            <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                            <View style = {styles.loading}><Text style = {styles.loadingTextSize}>数据正在加载中，客官请稍等</Text></View>
                    </ContentContainer>
              )
        }
    }
})
        
var styles = StyleSheet.create({
    loading:{
        width: Dimensions.screenWidth,
        height: Dimensions.screenHeight-Dimensions.toolBarHeight-Dimensions.tabBarHeight,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingTextSize:{
        fontSize:Dimensions.size["7"]
    },
    rowView:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["25"],
        paddingLeft: Dimensions.size["12"],
        paddingRight: Dimensions.size["12"],
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:"white",
        borderBottomColor:"#D8D8D8",
        borderStyle:"solid",
        borderBottomWidth: 1,
    },
    time:{
        paddingTop: Dimensions.size["5"],
        paddingLeft: Dimensions.size["8"],
        paddingBottom: Dimensions.size["4"],
        flexDirection:"row",
        justifyContent: "flex-start",
        backgroundColor:"#F6F1EB"
    },
    timeText:{
        width: Dimensions.size["36"],
        height: Dimensions.size["10"],
        backgroundColor:"#DFDFDF",
        color: "white",
        borderRadius: 2,
        fontSize: Dimensions.size["6"],
        lineHeight: Dimensions.size["10"],
        textAlign: "center"
    },
    paperText:{
        width: Dimensions.size["66"],
        fontSize: Dimensions.size["6"],
        overflow: "hidden",
        fontWeight: "bold",
        color: "#323232"
    },
    currayText:{
        width: Dimensions.size["24"],
        fontSize: Dimensions.size["8"],
        color: "#74C93C"
    },
    currayTextTop:{
        width: Dimensions.size["24"],
        fontSize: Dimensions.size["7"],
        color: "#F85934"
    },
    blank:{
         width: Dimensions.size["6"]
    }
})

module.exports = HomeListView;