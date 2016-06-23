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
    PanResponder,
    Animated
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var {ToggleButton} = require('../base/react-native-form');
var WebAPIUtils = require('../../utils/web-api-utils');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
var RadioGroup = require('../base/react-native-radio');

var ReactNativeWebview = require('../base/react-native-webview');
//图片资源
var btn_drop_down = require('../../images/btn_drop_down.png');
var btn_drop_up = require('../../images/btn_drop_up.png');
var ico_happy = require('../../images/ico_happy.png');
var ico_unhappy = require('../../images/ico_unhappy.png');

var TopicDetail = React.createClass({
    getInitialState:function(){
        return{
            toggle:false,
            name: ""
        }
    },
    _onSelectOption:function(option,topic_id,selected){
        if(this.props.onPress){
            this.props.onPress(option,topic_id,selected);
        };
    },
    onHelpIconPress:function(e,name,toggle){
        this.setState({
            toggle: toggle,
            name:name
        })
	},
    _onCheckAnalysis:function(){
		var toggle = this.state.toggle;
        var name = this.state.name;
        var rowData = this.props.rowData;
        var std_answer = !!rowData.std_answer.raw?rowData.std_answer.raw:"略";
        if(name == "flag"){
            if(toggle){
                var animate = new Animated.Value(0.01)
                Animated.timing(animate,{toValue:Dimensions.size["64"]}).start();
            }else{
                var animate = new Animated.Value(Dimensions.size["64"])
                Animated.timing(animate,{toValue:0.01}).start();
            };
        }else{
            var animate = 0.01;
        };
		return  (
			<Animated.View  collapsable={false} style={{"height":animate,"overflow":"hidden"}}>
				<View style={styles.viewDetails}>
                       <View style = {{paddingLeft:Dimensions.size["5"]}}>
                            <View><Text style = {styles.fontStyle}>正确答案：</Text></View>
                            <ReactNativeWebview name = {std_answer} style = {styles.webView} />
                     </View>
			   </View>
			</Animated.View>)
	},
    render:function(){
        var {rowData,onPress,...props} = this.props;
        var CheckAnalysis = this._onCheckAnalysis();
        if(rowData.topic_type == "1"){
             return(
                    <View style={styles.rowcontainer}>
                         <View style = {styles.viewContant}>
                              <ReactNativeWebview name = {rowData.topic_content} style = {styles.webView} />
                              <RadioGroup rowData = {rowData} onPress = {this._onSelectOption} />
                         </View>
                    </View>
             )
        }
        if(rowData.topic_type != "1"){
            return(
                <View>
                    <View style={[styles.rowcontainer]}>
                         <View style = {styles.viewContant}>
                              <ReactNativeWebview name = {rowData.topic_content} style = {styles.webView} />
                         </View>
                    </View>
                    <View style = {styles.blank1}></View>
                    <View style = {styles.viewAnalysis}>
                        <View style = {styles.viewAnalysisOne}>
                             <Text style = {styles.fontStyle1}>请在纸上作答，然后</Text>
                        </View>
                        <View style = {styles.viewAnalysisTwo}>
                            <View><Text style = {styles.fontStyle1}>查看解析</Text></View>
                            <ToggleButton name="flag" icon={btn_drop_down} toggleIcon={btn_drop_up} style={styles.next} iconHeight={Dimensions.size["8"]} iconWidth={Dimensions.size["8"]} onPress={this.onHelpIconPress}/>
                        </View>
                    </View>
                    {CheckAnalysis}
                    <View style = {styles.blank}></View>
                    <View style = {[styles.answer,styles.answerHeight]}>
                        <SureSuccess source = {ico_happy} content = "答对了"  current = "1" topicID = {rowData.topic_id} onPress = {this._onAnswerOption} />
                        <SureSuccess source = {ico_unhappy}  content = "答错了"  current = "0" topicID = {rowData.topic_id} onPress = {this._onAnswerOption} />
                    </View>
                </View>
            )
       }
    }
});

var SureSuccess = React.createClass({
    _onSureSuccess:function(){
        if(this.props.onPress){
            this.props.onPress(this.props.current,this.props.topicID);
        }
    },
    render:function(){
        var {content,topicID,current,source,...props} = this.props;
        return (
            <TouchableOpacity onPress={this._onSureSuccess}>
                <View style = {[styles.answerCenter,styles.answerBorder]}>
                    <Image source = {this.props.source} style = {{width:Dimensions.size["10"],height:Dimensions.size["10"]}} />
                    <View><Text style = {styles.fontStyle}>{this.props.content}</Text></View>
                </View>
            </TouchableOpacity>
        )
    }
});

var HomeListView = React.createClass({
    getInitialState:function(){
        WebAPIUtils.getTopicSuggest({"topic_id":this.props.topic_id});
        return {
            _topic_suggest:SystemStore.getTopicSuggest(),
            selectedflag: 0,
            form_data:{}
        }
    },
    componentWillMount() {
        var _self = this;
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (e, gestureState)=>_self._handleStartShouldSetPanResponder(e, gestureState),
          onMoveShouldSetPanResponder: (e, gestureState)=>_self._handleMoveShouldSetPanResponder(e, gestureState),
          onPanResponderGrant: (e, gestureState)=>_self._handlePanResponderGrant(e, gestureState),
          onPanResponderMove: (e, gestureState)=>_self._handlePanResponderMove(e, gestureState),
          onPanResponderRelease: (e, gestureState)=>_self._handlePanResponderEnd(e, gestureState)
        })
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_TOPIC_SUGGEST,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_TOPIC_SUGGEST,this._onChange);
    },
    _handleStartShouldSetPanResponder:function(e: Object, gestureState: Object): boolean {
        return true
    },
    _handleMoveShouldSetPanResponder:function(e: Object, gestureState: Object): boolean {
       return true
    },
    _handlePanResponderGrant:function(e: Object, gestureState: Object) {},
    _handlePanResponderMove:function(e: Object, gestureState: Object) {},
    _handlePanResponderEnd:function(e: Object, gestureState: Object) {
          var dx = gestureState.dx;
          var dy = gestureState.dy;
          var absDx = dx>0?dx:-dx;
          var absDy = dy>0?dy:-dy;
          var moveX = (absDx / Dimensions.screenWidth)*100;
          var selectedflag = this.state.selectedflag;
          if(dx < 0 && moveX > 20){
            if(selectedflag == 2){
                selectedflag = 0;
            }else{
                selectedflag = selectedflag +1;
            }
            this.setState({
                selectedflag: selectedflag
            });
          }
    },
    _onChange:function(){
        this.setState({
            _topic_suggest:SystemStore.getTopicSuggest()
        })
    },
    _onSelestedTopic:function(option,topic_id,selected){
        var _topic_suggest = this.state._topic_suggest;
        if(selected){
            for(var i = 0; i < _topic_suggest.length; i++){
                if(_topic_suggest[i].topic_id == topic_id){
                    var topic_options = _topic_suggest[i].topic_options;
                    for(var j = 0; j < topic_options.length; j++){
                        if(topic_options[j].option == option){
                            topic_options[j].selected = selected;
                        }else{
                            topic_options[j].selected = "";
                        }
                    }
                }
            }
        }
        this.setState({
            _topic_suggest: _topic_suggest
        })
        var form_data = this.state.form_data;
        if(!form_data["topic_id"]){
            form_data["topic_id"] = {};
        }
        form_data["topic_id"][topic_id] = option;
    },
    onNavIconPress:function(){
		History.popRoute();
	},
    _onGetSuggset:function(){
        var selectedflag = this.state.selectedflag;
        var _topic_suggest = this.state._topic_suggest;
        if(_topic_suggest.length > 0){
            return _topic_suggest[selectedflag];
        }
        return [];
    },
    _onJumpPractice:function(){
         var form_data = this.state.form_data;
         History.pushRoute("/wrong/practiceEnd/"+this.props.topic_id+"/"+form_data)
    },
    render:function(){
        var _topic_suggest = this.state._topic_suggest;
        var selectedflag = this.state.selectedflag;
        var form_data = this.state.form_data;
        var rowData = this._onGetSuggset();
        form_data["topic_type"] = rowData.topic_type;
        if(_topic_suggest.length > 0){
            return (<ContentContainer>
                            <ToolBar navIcon={{title:"<返回"}}  title="攻克训练" onNavIconPress={this.onNavIconPress}></ToolBar>
                            <View style = {styles.practiceTop}>
                                     <View style = {[styles.selectPractice,selectedflag == 0?styles.selectedPractice:""]}></View>
                                     <View style = {[styles.selectPractice,selectedflag == 1?styles.selectedPractice:""]}></View>
                                     <View style = {[styles.selectPractice,selectedflag == 2?styles.selectedPractice:""]}></View>
                            </View>
                            <ScrollView style = {styles.scrollView}>
                                <RowContainer>
                                    <View  {...this._panResponder.panHandlers} >
                                        <TopicDetail rowData = {rowData} onPress = {this._onSelestedTopic} />
                                    </View>
                                </RowContainer>
                            </ScrollView>
                            <TouchableHighlight ref = "practiceEnd" onPress = {this._onJumpPractice}>
                                <View style = {styles.practiceEnd}><Text style = {{fontSize: Dimensions.size["8"]}}>提交答案</Text></View>
                            </TouchableHighlight>
                    </ContentContainer>)
        }else{
            return(<ContentContainer>
                            <ToolBar navIcon={{title:"<返回"}}  title="攻克训练" onNavIconPress={this.onNavIconPress}></ToolBar>
                            <View style = {styles.loading}><Text style = {styles.fontStyle}>没有同类型的题目</Text></View>
                    </ContentContainer>)
        }
    }
});


var styles = StyleSheet.create({
    loading:{
        width: Dimensions.screenWidth,
        height: Dimensions.screenHeight-Dimensions.toolBarHeight-Dimensions.tabBarHeight,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    scrollView:{
        height: Dimensions.screenHeight-Dimensions.toolBarHeight-Dimensions.tabBarHeight
    },
    practiceEnd:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["25"],
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor:"#d8d8d8",
		borderTopWidth:1,
		borderStyle:"solid"
    },
    answerCenter:{
        width: Dimensions.screenWidth/2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    answerHeight:{
        height:Dimensions.size["25"]
    },
    answerBorder:{
        borderColor:"#d8d8d8",
		borderRightWidth:1,
		borderStyle:"solid"
    },
    viewAnalysis:{
        width: Dimensions.screenWidth,
        height: Dimensions.size["22"],
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    viewAnalysisOne:{
        width: Dimensions.screenWidth/2,
        paddingLeft: Dimensions.size["5"]
    },
    viewAnalysisTwo:{
        width: Dimensions.screenWidth/2,
        paddingRight: Dimensions.size["5"],
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    next:{
		width:Dimensions.size["8"],
		height:Dimensions.size["8"],
        marginTop: 10,
		paddingHorizontal:Dimensions.size["0"]
	},
    fontStyle:{
        fontSize: Dimensions.size["7"]
    },
    fontStyle1:{
        fontSize: Dimensions.size["6"]
    },
    blank1:{
        width: Dimensions.screenWidth - Dimensions.size["4"],
        marginLeft: Dimensions.size["2"],
        marginRight: Dimensions.size["2"],
        height: 1,
        backgroundColor: "#D8D8D8"
    },
    answer:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    practiceTop:{
        height: Dimensions.size["7"],
        backgroundColor: "#ddd",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    selectPractice:{
        width: Dimensions.size["10"],
        height: Dimensions.size["2"],
        borderRadius:2,
        backgroundColor: "#D8D8D8",
        marginRight: Dimensions.size["4"]
    },
    selectedPractice:{
        backgroundColor: "#74C93C"
    },
    rowcontainer:{
        paddingTop: Dimensions.size["7"],
        paddingLeft: Dimensions.size["5"],
        paddingRight: Dimensions.size["5"]
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
})

module.exports = HomeListView;