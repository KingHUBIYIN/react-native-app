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
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var ReactNativeWebview = require('../base/react-native-webview');

var ico_train = require("../../images/ico_train.png");

var HomeTopicDetailView = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            student_info: SystemStore.getSubjectByName(this.props.subject),
            _topic_detail: SystemStore.getTopicDetail(this.props.answer_sheet_id,this.props.topic_no),
            answers: ds.cloneWithRows(SystemStore.getTopicDetail(this.props.answer_sheet_id,this.props.topic_no).answers)
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
    _onJumpPratice:function(){
        History.pushRoute("/wrong/practice/"+this.props.topic_id)
    },
    _renderRow:function(rowData, sectionID, rowID){
        return(
            <ReactNativeWebview name = {rowData} style = {styles.selectContent} />
        )
    },
    render:function(){
        var student_info = this.state.student_info;
        var _topic_detail = this.state._topic_detail;
        var topic_answer_raw = _topic_detail.topic_answer?_topic_detail.topic_answer.raw:"略";
        var answers = this.state.answers;
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title="题目" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View style = {styles.rowContainer}>
                            <View style = {styles.topicTitle}>
                                <View><Text style = {styles.fontText}>{_topic_detail.name}</Text></View>
                                <View><Text style = {styles.fontText}>{_topic_detail.no}题</Text></View>
                            </View>
                            <View style = {styles.blankStyle}></View>
                        </View>
                        <ScrollView style = {styles.ScrollView}>
                            <ReactNativeWebview name = {_topic_detail.content} style = {styles.viewContent} />
                            <ListView 
                                enableEmptySections={true} 
                                dataSource={answers} 
                                renderRow={this._renderRow}
                            />
                            <View style = {styles.blankStyle1}></View>
                            <View style = {styles.paddingStyles}>
                                    <View><Text style = {styles.fontStyle}>正确答案：</Text></View>
                                    <ReactNativeWebview name = {_topic_detail.std_answer} style = {styles.viewContent} />
                            </View>
                            <View style = {styles.paddingStyles}>
                                    <View><Text style = {styles.fontStyle}>解：</Text></View>
                                    <ReactNativeWebview name = {topic_answer_raw} style = {styles.viewContent} />
                            </View>
                            <View style = {[styles.paddingStyles,styles.rowStyle]}>
                                    <View><Text style = {styles.fontStyle}>考点：</Text></View>
                                    <View style = {styles.borderstyle}><Text style = {[styles.fontStyle,{color: "#74C93C"}]}>{_topic_detail.section}</Text></View>
                            </View>
                            <View style = {[styles.paddingStyles,styles.rowStyle]}>
                                    <View><Text style = {styles.fontStyle}>来源：</Text></View>
                                    <View></View>
                            </View>
                            <View style = {[styles.paddingStyles,styles.rowStyle]}>
                                    <View><Text style = {styles.fontStyle}>难点：</Text></View>
                                    <View><Text style = {styles.fontStyle}>{_topic_detail.nandu}</Text></View>
                            </View>
                            <View style = {{height: 100}}></View>
                        </ScrollView>
                        
                        <View style = {styles.footer}>
                             <TouchableOpacity onPress = {this._onJumpPratice}>
                                <View style = {styles.footerCotent}>
                                    <Image source = {ico_train} />
                                    <Text style = {styles.footSize}>攻克训练</Text>
                                </View>
                             </TouchableOpacity>
                        </View>
                </ContentContainer>)
    }
});
        
var styles = StyleSheet.create({
    rowContainer:{
        paddingLeft: Dimensions.size["5"],
        paddingRight: Dimensions.size["5"],
        backgroundColor: "#fff"
    },
    topicTitle:{
        width: Dimensions.screenWidth  - Dimensions.size["10"],
        height: Dimensions.size["22"],
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"space-between"
    },
    fontText:{
        fontSize: Dimensions.size["7"]
    },
    fontTextContent:{
        fontSize: Dimensions.size["8"]
    },
    blankStyle:{
        backgroundColor: "#D8D8D8",
        width: Dimensions.screenWidth  - Dimensions.size["10"],
        height: 1
    },
    blankStyle1:{
        backgroundColor: "#D8D8D8",
        height: 1
    },
    ScrollView:{
        width: Dimensions.screenWidth,
        height: Dimensions.screenHeight - Dimensions.toolBarHeight - Dimensions.size["22"],
        paddingTop: Dimensions.size["6"],
        paddingLeft: Dimensions.size["5"],
        paddingRight: Dimensions.size["5"],
        backgroundColor: "#fff"
    },
    viewContent:{
        width: Dimensions.screenWidth - Dimensions.size["10"],
        height:100
    },
    selectContent:{
        width: Dimensions.screenWidth - Dimensions.size["10"],
        height:Dimensions.size["8"]
    },
    footer:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["22"],
        backgroundColor: "#74C93C",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
    },
    footerCotent:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    footSize:{
        fontSize: Dimensions.size["8"],
        fontWeight: "bold",
        color: "white",
        textAlign:"center"
    },
    paddingStyles:{
        paddingTop: Dimensions.size["5"],
        paddingBottom: Dimensions.size["5"]
    },
    rowStyle:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems: "center"
    },
    fontStyle:{
        fontSize: Dimensions.size["7"]
    },
    borderstyle:{
        borderStyle: "solid",
        borderWidth:1,
        borderColor: "#74C93C",
        padding: Dimensions.size["2"]
    }
})

module.exports = HomeTopicDetailView;