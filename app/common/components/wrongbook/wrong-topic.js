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
    WebView,
    Animated
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {ToggleButton} = require('../base/react-native-form');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var ReactNativeWebview = require('../base/react-native-webview');

//图片资源
var ico_train = require("../../images/ico_train.png");
var btn_drop_down = require('../../images/btn_drop_down.png');
var btn_drop_up = require('../../images/btn_drop_up.png');
var ico_star_normal = require('../../images/ico_star_normal.png');
var ico_star_select = require('../../images/ico_star_select.png');

var WrongTopic = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            _topic_detail: SystemStore.getWrongTopicDetailByTopicId(this.props.answer_sheet_id,this.props.topic_id),
            answers: ds.cloneWithRows(SystemStore.getWrongTopicDetailByTopicId(this.props.answer_sheet_id,this.props.topic_id).answers),
            toggle:false,
            name:""
        }
    },
    onNavIconPress:function(){
		History.popRoute();
	},
    _renderRow:function(rowData, sectionID, rowID){
        return(
            <ReactNativeWebview name = {rowData} style = {styles.selectContent} />
        )
    },
    onHelpIconPress:function(e,name,toggle){
        this.setState({
            toggle: toggle,
            name:name
        })
	},
    _onJumpPratice:function(){
        History.pushRoute("/wrong/practice/"+this.props.topic_id)
    },
    _onCheckAnalysis:function(){
		var toggle = this.state.toggle;
        var _topic_detail = this.state._topic_detail;
        var topic_answer_raw = _topic_detail.topic_answer?_topic_detail.topic_answer.raw:"略";
        var answer = _topic_detail.answer?_topic_detail.answer:"略";
        var name = this.state.name;
        if(name == "flag"){
            if(toggle){
                var animate = new Animated.Value(0.01)
                Animated.timing(animate,{toValue:Dimensions.size["200"]}).start();
            }else{
                var animate = new Animated.Value(Dimensions.size["200"])
                Animated.timing(animate,{toValue:0.01}).start();
            };
        }else{
            var animate = 0.01;
        };
		return  (
			<Animated.View  collapsable={false} style={{"height":animate,"overflow":"hidden"}}>
				<View style={styles.viewDetails}>
                       <View style = {styles.paddingStyles}>
                                <View><Text style = {styles.fontStyle}>正确答案：</Text></View>
                                <ReactNativeWebview name = {answer} style = {styles.viewContent} />
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
			   </View>
			</Animated.View>)
	},
    render:function(){
        var _topic_detail = this.state._topic_detail;
        var topic_answer_raw = _topic_detail.topic_answer?_topic_detail.topic_answer.raw:"略";
        var answer = _topic_detail.answer?_topic_detail.answer:"略";
        var answers = this.state.answers;
        var CheckAnalysis = this._onCheckAnalysis();
        return (<ContentContainer>
                     <ToolBar navIcon={{title:"<返回"}}  title="题目" onNavIconPress={this.onNavIconPress}></ToolBar>
                     <View style = {{backgroundColor: "#fff"}}>
                        <ScrollView style = {styles.ScrollView}>
                           <View style = {{paddingLeft: Dimensions.size["5"],paddingRight: Dimensions.size["5"]}}>
                                    <ReactNativeWebview name = {_topic_detail.content} style = {styles.viewContent} />
                                    <ListView 
                                        enableEmptySections={true} 
                                        dataSource={answers} 
                                        renderRow={this._renderRow}
                                    />
                                    <View style = {styles.blankStyle1}></View>

                                    <View style = {styles.viewAnalysis}>
                                        <View><Text style = {styles.fontStyle}>查看解析</Text></View>
                                        <ToggleButton name="flag" icon={btn_drop_down} toggleIcon={btn_drop_up} style={styles.next} iconHeight={Dimensions.size["8"]} iconWidth={Dimensions.size["8"]} onPress={this.onHelpIconPress}/>
                                    </View>
                                    {CheckAnalysis}
                            </View>
                            <View style = {{height:Dimensions.size["5"],backgroundColor: "#ddd"}}></View>   
                            <View style = {{paddingLeft: Dimensions.size["2"],paddingRight: Dimensions.size["2"]}}>
                                <View style = {[styles.footerCotent,styles.WrongHeight]}>
                                     <View><Text style = {styles.fontStyle}>重要程度</Text></View>
                                     <View style = {styles.Imgs}>
                                            <Image source = {ico_star_normal} style = {styles.Image}/>
                                            <Image source = {ico_star_normal} style = {styles.Image}/>
                                            <Image source = {ico_star_normal} style = {styles.Image}/>
                                            <Image source = {ico_star_normal} style = {styles.Image}/>
                                            <Image source = {ico_star_normal} style = {styles.Image}/>
                                     </View>
                                </View>
                                <View style = {[styles.footerCotent,styles.WrongHeight]}><Text style = {styles.fontStyle}>怎么错的？</Text></View>
                                <View style = {[styles.footerCotent,styles.WrongHeight]}><Text style = {styles.fontStyle}>添加笔记+</Text></View>
                            </View>
                            <View style = {{height: 40}}></View>
                        </ScrollView>
                    </View>                        
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
    Image:{
        width: Dimensions.size["10"],
        height: Dimensions.size["10"],
        marginLeft: Dimensions.size["2"]
    },
    rowContainer:{
        paddingLeft: Dimensions.size["5"],
        paddingRight: Dimensions.size["5"]
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
        marginTop: Dimensions.size["2"],
        backgroundColor: "#D8D8D8",
        height: 1
    },
    ScrollView:{
        width: Dimensions.screenWidth,
        height: Dimensions.screenHeight - Dimensions.toolBarHeight - Dimensions.size["22"],
        paddingTop: Dimensions.size["6"],
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
        fontSize: Dimensions.size["6"]
    },
    borderstyle:{
        borderStyle: "solid",
        borderWidth:1,
        borderColor: "#74C93C",
        padding: Dimensions.size["2"]
    },
    next:{
		width:Dimensions.size["8"],
		height:Dimensions.size["8"],
        marginTop: 10,
		paddingHorizontal:Dimensions.size["0"]
	},
    viewAnalysis:{
        height: Dimensions.size["20"],
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    WrongHeight:{
        height: Dimensions.size["25"],
        borderStyle: "solid",
        borderBottomWidth:1,
        borderColor: "#D8D8D8"
    },
    Imgs:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: Dimensions.size["2"]
    }
})

module.exports = WrongTopic;