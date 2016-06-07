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

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var TopicNo = React.createClass({
    handleClick:function(){
        if(this.props.onPress){
            this.props.onPress(this.props.rowData.topic_no);
        }
    },
    render:function(){
        var {active,rowData,onPress,...props} = this.props;
        return(
            <TouchableOpacity onPress = {this.handleClick}>
                <View>
                     <View style = {[styles.span,active?styles.colorRight:styles.colorError]}>
                            <Text style = {styles.spanText}>{rowData.topic_no}</Text>
                     </View>
                </View>
            </TouchableOpacity>
        )
    }
});

var HomeListView = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            student_info: SystemStore.getSubjectByName(this.props.subject),
            getAnswerSheet: SystemStore.getAnswerSheet(this.props.answer_sheet_id),
            exam_info: ds.cloneWithRows(SystemStore.getAnswerSheet(this.props.answer_sheet_id).exam_info.exam_info),
            form_data: ""
        }
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    _onChange:function(){
        this.setState({
             student_info: SystemStore.getSubjectByName(this.props.subject)
        })
    },
    onNavIconPress:function(){
		History.popRoute();
	},
    _onTopicDetail:function(topic_no){
        var form_data = this.state.form_data;
        form_data  = topic_no;
        this.setState({
            form_data: form_data
        })
    },
    _onQueryDetail:function(){
        var form_data = this.state.form_data;
        if(form_data == ""){
            Alert.alert("","请选择要查看的试题",[{text:"确定"}]);
            return false;
        }
        History.pushRoute("/home/details/"+this.props.subject + "/" + this.props.answer_sheet_id+"/"+form_data);
    },
    _onQueryErrorTopics:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        //过滤出错误的题目
        this.setState({
            exam_info: ds.cloneWithRows(SystemStore.getAnswerSheetError(this.props.answer_sheet_id).exam_info._exam_info_error),
        })
    },
    _renderRow:function(rowData, sectionID, rowID){
        var spec = this.state.getAnswerSheet.answer_sheet.spec;
        var active = spec == "A4"?rowData.correct:rowData.score == rowData.fullmark;
        return(
            <TopicNo rowData = {rowData} active = {active} onPress = {this._onTopicDetail} />
        )
    },
    render:function(){
        var student_info = this.state.student_info;
        var getAnswerSheet = this.state.getAnswerSheet;
        var exam_info = this.state.exam_info?this.state.exam_info:{};
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                        <ScrollView style = {styles.ScrollView}>
                            <View style = {styles.topBlank}></View>
                            <RowContainer style = {styles.RowContainer}>
                                    <View style = {styles.topicTitle}>
                                        <View style = {styles.layoutView}>
                                            <View><Text style = {styles.textSize}>答对<Text style = {styles.textSizeTwo}>{getAnswerSheet.rightTopic}</Text>题</Text></View>
                                            <View style = {styles.marginTopic}><Text style = {styles.textSize}>共 {getAnswerSheet.count} 题</Text></View>
                                        </View>
                                    </View>
                                    <View style = {styles.answerTopic}>
                                            <Text style = {styles.textSize}>答题卡</Text>		
                                    </View>
                                    <ListView 
                                        contentContainerStyle = {styles.list}
                                        enableEmptySections={true} 
                                        dataSource={exam_info} 
                                        renderRow={this._renderRow}
                                    />
                            </RowContainer>  
                        </ScrollView>
                        <View style = {styles.footer}>
                             <TouchableOpacity onPress = {this._onQueryDetail}>
                                    <View style = {[styles.footborder,styles.footWidth]}><Text style = {styles.footSize}>查看解析</Text></View>
                             </TouchableOpacity>
                             <TouchableOpacity onPress = {this._onQueryErrorTopics}>
                                    <View style = {styles.footWidth}><Text style = {styles.footSize}>只看错题</Text></View>
                             </TouchableOpacity>
                        </View>
                </ContentContainer>)
    }
});
        
var styles = StyleSheet.create({
    ScrollView:{
        width: Dimensions.screenWidth,
        height: Dimensions.screenHeight - Dimensions.toolBarHeight - Dimensions.size["24"]
    },
    topBlank:{
        height: Dimensions.size["5"],
        backgroundColor: "#fff"
    },
    RowContainer:{
        paddingLeft: Dimensions.size["5"],
        paddingRight: Dimensions.size["5"]
    },
    topicTitle:{
        height: Dimensions.size["22"],
        paddingLeft:Dimensions.size["4"],
        paddingRight:Dimensions.size["4"],
        borderBottomColor: "#D8D8D8",
        borderStyle: "dashed",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    answerTopic:{
        height: Dimensions.size["22"],
        paddingLeft:Dimensions.size["4"],
        paddingRight:Dimensions.size["4"],
        paddingTop: Dimensions.size["6"],
        paddingBottom: Dimensions.size["6"],
        borderBottomColor: "#D8D8D8",
        borderStyle: "dashed",
        borderBottomWidth: 0,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-around",
        paddingLeft:Dimensions.size["10"],
        paddingRight:Dimensions.size["10"],
        paddingBottom: Dimensions.size["12"]
    },
    layoutView:{
        width: Dimensions.screenWidth - Dimensions.size["18"],
        flexDirection: "row",
        justifyContent: "space-between"
    },
    textSize:{
        fontSize: Dimensions.size["7"]
    },
    textSizeTwo:{
        fontSize: Dimensions.size["12"],
        color: "#74C93C"
    },
    marginTopic:{
        marginTop: Dimensions.size["6"]
    },
    span:{
        width: Dimensions.size["15"],
        height: Dimensions.size["15"],
        marginRight: Dimensions.size["2"],
        marginBottom: Dimensions.size["10"],
        backgroundColor: "#74C93C",
        borderRadius: Dimensions.size["12"],
        justifyContent: "center",
    },
    spanText:{
         fontSize: Dimensions.size["8"],
         color: "white",
         textAlign: "center"
    },
    colorRight:{
        backgroundColor: "#74C93C"
    },
    colorError:{
        backgroundColor: "red"
    },
    footer:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["25"],
        backgroundColor: "#74C93C",
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
        color: "white",
        textAlign:"center"
    }
})

module.exports = HomeListView;