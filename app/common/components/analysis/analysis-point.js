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
var btn_next_press = require("../../images/btn_next_press.png");
var btn_last_press = require("../../images/btn_last_press.png");

var SectionsList = React.createClass({
    _onhandleClick:function(){
        if(this.props.onPress){
            this.props.onPress();
        }
    },
    render:function(){
        var {rowData,onPress,...props} = this.props;
        return(
            <TouchableOpacity onPress={this._onhandleClick}>
                <View style={styles.sectionView}><Text style={styles.sectionStyle}>{rowData.className}</Text></View>
            </TouchableOpacity>
        )
    }
});

var AnalysisPointView = React.createClass({
     getInitialState:function(){
        var studentInfo = SystemStore.getStudentInfo();
        WebAPIUtils.getSubjectAttrs({grade:"七年级",grade_sub:"上",subject:"数学",version:"苏教版",grade_num:studentInfo.grade_num});
        var subjectInfo = SystemStore.getSubjectByName("math");
        WebAPIUtils.getKnowMap({subject_id:subjectInfo.subject_id});
        return{
            chartDatas:SystemStore.getKnowledgeChartData("数学"),
            subjectInfo:SystemStore.getSubjectByName("math"),
            form_data:{
                grade:"七年级",
                grade_sub:"上",
                subject:"数学",
                version:"苏教版",
                grade_num:subjectInfo.grade_num
            },
            chartIndex:0
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
    _onChange:function(){
        var form_data = this.state.form_data;
        this.setState({
            chartDatas:StudentStore.getKnowledgeChartData(form_data.subject),
        })
    },
    _onPrevNodes:function(e){
        var index = this.state.chartIndex;
        this.setState({
            chartIndex:index-1
        });
    },
    _onNextNodes:function(e){
        var index = this.state.chartIndex;
        this.setState({
            chartIndex:index+1
        });
    },
    _getDatasSource:function(){
        var index = this.state.chartIndex;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return ds.cloneWithRows(this.state.chartDatas[index]);
    },
    _onSelsectedScetion:function(){
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <SectionsList rowData={rowData} onPress={this._onSelsectedScetion} />
        )
    },
    render:function(){
        var index = this.state.chartIndex;
        var length = this.state.chartDatas.length;
        var datas = this._getDatasSource();
        var title = datas?"第"+(index+1)+"章 "+datas[0].chapter:"";
        var tips = {
            green:"已掌握",
            red:"未掌握",
            yellow:"掌握不牢",
            none:"未做检测",
        };
        return (<View>
                       <NavBars name="/analysis/index/point" />
					   <View style={styles.topCotent}>
							<View style={styles.marRight}><Text style={styles.fontStyle}>数学</Text></View>
							<View style={styles.marRight}><Text style={styles.fontStyle}>苏教版</Text></View>
							<View style={styles.marRight}><Text style={styles.fontStyle}>七年级上</Text></View>
					   </View>
                       <RowContainer style={styles.rowContainer}>
                            <View style={styles.contentTitle}>
                                <Image source={btn_last_press} />
                                <View><Text style={styles.fontStyle}>{title}</Text></View>
                                <Image source={btn_next_press} />
                            </View>
                            <ListView 
                                enableEmptySections={true} 
                                onEndReachedThreshold = {10}
                                dataSource = {datas}
                                renderRow = {this._onRenderRow}
                            />
                       </RowContainer>
                </View>)
    }
});
        
var styles = StyleSheet.create({
    topCotent:{
        width:Dimensions.screenWidth,
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
    },
    sectionView:{
        height: Dimensions.size["15"],
        paddingLeft:Dimensions.size["5"],
        paddingRight:Dimensions.size["5"],
        marginBottom:Dimensions.size["9"]
    },
    sectionStyle:{
        fontSize:Dimensions.size["7"],
        color: "#fff"
    }
})

module.exports = AnalysisPointView;