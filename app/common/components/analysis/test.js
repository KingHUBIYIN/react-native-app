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
var ReactNativeWebview = require('../base/react-native-webview');
var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
var WebAPIUtils = require('../../utils/web-api-utils');
var NavBars = require('../base/navbars');

//图片资源
var ico-back-normal = require("../../images/ico-back-normal.png");
var ico-next-normal = require("../../images/ico-next-normal.png");

var AnalysisPointView = React.createClass({
    getInitialState:function(){
        var studentInfo = SystemStore.getStudentInfo();
        WebAPIUtils.getSubjectAttrs({grade:"七年级",grade_sub:"上",subject:"数学",version:"苏教版",grade_num:studentInfo.grade_num});
        var subjectInfo = SystemStore.getSubjectByName("math");
        WebAPIUtils.getKnowMap({subject_id:subjectInfo.subject_id});
        return{
            chartDatas:SystemStore.getKnowledgeChartData("数学"),
            subjectInfo:SystemStore.getSubjectByName("math"),
            pieIndex:0,
            subject:false,
            form_data:{
                grade:"七年级",
                grade_sub:"上",
                subject:"数学",
                version:"苏教版",
                grade_num:subjectInfo.grade_num
            },
            subject_position:{left:0,top:0},
            chartIndex:0,
            hoverNode:{},
            hoverPos:{
                x:0,
                y:0
            }
        }
    },
    componentDidMount:function(){
		SystemStore.addChangeListener(EventTypes.RECEIVED_KONW_MAP,this._onChange);
		SystemStore.addChangeListener(EventTypes.RECEIVED_SUBATTRS,this._onChange);
    },
    componentWillUnmount:function(){ 
		SystemStore.removeChangeListener(EventTypes.RECEIVED_KONW_MAP,this._onChange);
		SystemStore.removeChangeListener(EventTypes.RECEIVED_SUBATTRS,this._onChange);
    },
    _selectPieChartTab:function(e){
        e =  e ||event;
        var target  = e.target || e.srcElement;
        var index =parseInt($(target).attr("data-index"));
        this.setState({ pieIndex:index });
    },
    _onChange:function(){
        var form_data = this.state.form_data;
        this.setState({
            chartDatas:StudentStore.getKnowledgeChartData(form_data.subject),
        })
    },
    _toggleSubjectDialog:function(toggle){
        var $subject = $(ReactDOM.findDOMNode(this.refs.ddSubject));
        var position = $subject.position();
        this.setState({subject:toggle,subject_position:{left:position.left+69,top:position.top+29}});
    },
    _onSubjectClick:function(e){
        var studentInfo = StudentStore.getStudentInfo();
        e = e || window.event;
        var target = e.target || e.srcElement;
        subject = $(target).attr("data-subject");
        chinese = $(target).attr("data-chinese");
        var subjectInfo = StudentStore.getSubjectByName(subject);
        
        var form_data = this.state.form_data;
        form_data["subject"] = chinese;
        form_data["grade_num"] = studentInfo.grade_num;
        
	    StudentWebAPIUtils.getSubjectAttrs(form_data);
        StudentWebAPIUtils.getKnowMap({subject_id:subjectInfo.subject_id});
        this.setState({
            subject:false,
            subjectInfo:StudentStore.getSubjectByName(subject),
            form_data:form_data,
            pieIndex:0,
            chartIndex:0
        });
    },
    _onPrevNodes:function(e){
        var index = this.state.chartIndex;
        this.setState({chartIndex:index-1});
    },
    _onNextNodes:function(e){
        var index = this.state.chartIndex;
        this.setState({chartIndex:index+1});
    },
    _handleMouseLeave:function(e){
        this.setState({ hoverNode:{} });
    },
    _handleMouseEnter:function(e){
        e = e || event;
        var target = e.target || e.srcElement;
        var index = parseInt($(target).attr("data-index"));
        var dx = parseFloat($(target).attr("data-x"));
        var dy = parseFloat($(target).attr("data-y"));
        
        var chartIndex = this.state.chartIndex;
        var datas = this.state.chartDatas[chartIndex];
        this.setState({ 
            hoverNode:datas[index],
            hoverPos:{ x:dx, y:dy }
        });
    },
    render:function(){
        var index = this.state.chartIndex;
        var length = this.state.chartDatas.length;
        var datas = this.state.chartDatas[index];
        var title = datas?"第"+(index+1)+"章 "+datas[0].chapter:"";
        var bubble = d3.layout.pack().sort(null).size([960,700]).padding(10);
        var nodes = bubble.nodes({children:datas}).filter(function(d){
            return !d.children;
        });
        var tips = {
            green:"已掌握",
            red:"未掌握",
            yellow:"掌握不牢",
            none:"未做检测",
        }
        var hoverNode = this.state.hoverNode;
        var hoverPos = this.state.hoverPos;
        var handleMouseLeave = this._handleMouseLeave;
        var handleMouseEnter = this._handleMouseEnter;
        var infoPos = {
            x:hoverPos.x>700?hoverPos.x-200:hoverPos.x,
            y:hoverPos.y>440?hoverPos.y-260:hoverPos.y
        };
        
        var subjectInfo = this.state.subjectInfo;
        var onSubjectClick = this._onSubjectClick;
        var showSubject = this.state.subject;
        var subjectPos = this.state.subject_position;
        var hash = History.curHash.hash;
        return (<View>
                       <NavBars name="/analysis/index/point" />
					   <View style={styles.topCotent}>
							<View style={styles.marRight}><Text style={styles.fontStyle}>数学</Text></View>
							<View style={styles.marRight}><Text style={styles.fontStyle}>苏教版</Text></View>
							<View style={styles.marRight}><Text style={styles.fontStyle}>七年级上</Text></View>
					   </View>
                       <RowContainer style={styles.rowContainer}>
                            <View style={styles.contentTitle}>
                                <Image source={ico-back-normal} />
                                <View><Text style={styles.fontStyle}>{title}</Text></View>
                                <Image source={ico-next-normal} />
                            </View>
                       </RowContainer>
                </View>)
    }
});
        
var styles = StyleSheet.create({
    topCotent:{
        wdith:Dimensions.screenWidth,
        height:Dimensions.size["15"],
        paddingLeft:Dimensions.size["5"],
        backgroundColor:"#ddd",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start"
    },
    marRight:{
        marginRight:Dimensions.size["5"]
    },
    fontStyle:{
        fontSize:Dimensions.size["7"]
    },
    rowContainer:{
        paddingTop:Dimensions.size["16"],
        paddingRight:Dimensions.size["16"],
        paddingBottom:Dimensions.size["16"],
        paddingLeft:Dimensions.size["16"]
    },
    contentTitle:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    }
})

module.exports = AnalysisPointView;