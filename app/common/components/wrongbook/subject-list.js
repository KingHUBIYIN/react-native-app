

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
var {ContentContainer,RowContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var WebAPIUtils = require('../../utils/web-api-utils');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

//图片资源
var ico_math = require("../../images/ico_math.png");
var ico_chinese = require("../../images/ico_chinese.png");
var ico_english = require("../../images/ico_English.png");
var ico_subject = require("../../images/btn_next_normal.png");


var SubjectSeclet = React.createClass({
    handlePress:function(){
        if(this.props.onPress){
            this.props.onPress("/wrong/index/" +this.props.rowData.subject + "/ChoiceAll");
        }
    },
    render:function(){
        var {rowData,onPress,...props} = this.props;
        if(rowData.name == "数学"){
             return(
                <TouchableHighlight underlayColor = "#D8D8D8" onPress = {this.handlePress} {...props} >
                        <View style = {styles.subjectRow}> 
                                <View style = {styles.imagePadding}><Image source = {ico_math} style = {styles.image}/></View>
                                <View style = {[styles.bordStyle,styles.subjectRow]}>
                                        <View style = {styles.subjectStyle}><Text style = {styles.TextStyle}>{rowData.name}</Text></View>
                                        <View style = {styles.blankStyle}></View>
                                        <View style = {styles.fontSizeStyle}><Text style = {styles.TextStyle}>{rowData.total_error_num}</Text></View>
                                        <View style = {styles.fontSizeStyle}><Image source = {ico_subject} /></View>
                                </View>
                        </View>
                 </TouchableHighlight>
             )
        }
        if(rowData.name == "语文"){
             return(
                 <TouchableHighlight underlayColor = "#D8D8D8" onPress = {this.handlePress} {...props} >
                        <View style = {styles.subjectRow}> 
                                <View style = {styles.imagePadding}><Image source = {ico_chinese} style = {styles.image}/></View>
                                <View style = {[styles.bordStyle,styles.subjectRow,styles.borderNo]}>
                                        <View style = {styles.subjectStyle}><Text style = {styles.TextStyle}>{rowData.name}</Text></View>
                                        <View style = {styles.blankStyle}></View>
                                        <View style = {styles.fontSizeStyle}><Text style = {styles.TextStyle}>{rowData.total_error_num}</Text></View>
                                        <View style = {styles.fontSizeStyle}><Image source = {ico_subject} /></View>
                                </View>
                        </View>
                 </TouchableHighlight>
             )
        }
         if(rowData.name == "英语"){
             return(
                 <TouchableHighlight underlayColor = "#D8D8D8" onPress = {this.handlePress} {...props} >
                        <View style = {styles.subjectRow}> 
                                <View style = {styles.imagePadding}><Image source = {ico_english} style = {styles.image}/></View>
                                <View style = {[styles.bordStyle,styles.subjectRow]}>
                                        <View style = {styles.subjectStyle}><Text style = {styles.TextStyle}>{rowData.name}</Text></View>
                                        <View style = {styles.blankStyle}></View>
                                        <View style = {styles.fontSizeStyle}><Text style = {styles.TextStyle}>{rowData.total_error_num}</Text></View>
                                        <View style = {styles.fontSizeStyle}><Image source = {ico_subject} /></View>
                                </View>
                        </View>
                 </TouchableHighlight>
             )
        }
    }
})


var HomeListView = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return{
            _topic_error_num:ds.cloneWithRows(SystemStore.getExamErrorTopicNum())
        }
    },
    componentDidMount:function(){
        WebAPIUtils.getExamErrorTopicNum();
        SystemStore.addChangeListener(EventTypes.RECEIVED_EXAM_ERROR_TOPIC_NUM,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_EXAM_ERROR_TOPIC_NUM,this._onChange);
    },
    _onChange:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
             _topic_error_num: ds.cloneWithRows(SystemStore.getExamErrorTopicNum())
        })
    },
    _onPushHash:function(hash){
        History.pushRoute(hash);
    },
    _onRenderRow: function(rowData,sectionID,rowID){
        return(
            <SubjectSeclet rowData = {rowData} onPress = {this._onPushHash} />
        )
    },
    render:function(){
        var _topic_error_num = this.state._topic_error_num;
        return (<ContentContainer>
                        <ToolBar  title="错题本" ></ToolBar>
                        <RowContainer>
                                <ListView 
                                    enableEmptySections={true} 
                                    dataSource={_topic_error_num} 
                                    renderRow={this._onRenderRow}
                                />
                        </RowContainer>
                        <TabBars name="/wrong/subject"></TabBars>
                </ContentContainer>)
    }
});
    
var styles = StyleSheet.create({
    subjectRow:{
        height: Dimensions.size["32"],
        flexDirection:"row",
        alignItems:"center"
    },
    imagePadding:{
        paddingLeft: Dimensions.size["6"]
    },
    image:{
        width: Dimensions.size["24"],
        height: Dimensions.size["24"]
       
    },
    TextStyle:{
        fontSize: Dimensions.size["7"],
        textAlign: "center"
    },
    bordStyle:{
        borderStyle:"solid",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D8D8",
        marginLeft: Dimensions.size["2"]
    },
    borderNo:{
        borderStyle:"solid",
        borderBottomWidth: 0,
        borderBottomColor: "#D8D8D8"
    },
    subjectStyle:{
        width: Dimensions.size["24"]
    },
    fontSizeStyle:{
        width: Dimensions.size["15"]
    },
    blankStyle:{
        width: Dimensions.screenWidth - Dimensions.size["80"]
    }
})

module.exports = HomeListView;