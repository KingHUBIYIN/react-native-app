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

var ImageSelceted = React.createClass({
    handleClick:function(){
        if(this.props.type == "next"){
            if((this.props.len-1) == this.props.chartIndex){
                var chartIndex = this.props.chartIndex;
            }else{
                var chartIndex = this.props.chartIndex+1;
            }
        }else{
            if(this.props.chartIndex == 0){
                var chartIndex = 0
            }else{
                var chartIndex = this.props.chartIndex-1;
            }
        }
        if(this.props.onPress){
            this.props.onPress(chartIndex);
        }
    },
    render:function(){
        var {source,len,chartIndex,type,onPress,...props} = this.props;
        return(
            <TouchableOpacity onPress={this.handleClick}>
                <Image source={source} style={styles.Img}/>
             </TouchableOpacity>
        )
    }
});

var SectionsList = React.createClass({
    _onhandleClick:function(){
        if(this.props.onPress){
            this.props.onPress("/analysis/index/details?A3="+this.props.rowData.A3+"&A4="+this.props.rowData.A4+"&total="+this.props.rowData.total+"&percent="+this.props.rowData.percent+"&points="+this.props.rowData.points);
        }
    },
    render:function(){
        var {rowData,onPress,...props} = this.props;
        var style = rowData.percent>=100?styles.greenStyle:rowData.percent>=60?styles.yellowStyle:rowData.percent>0?styles.redStyle:styles.noneStyle;
        return(
            <TouchableOpacity onPress={this._onhandleClick}>
                <View style={[styles.sectionView,style]}><Text style={styles.sectionStyle}>{rowData.className}</Text></View>
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
            chartIndex:0,
            form_data:{
                grade:"七年级",
                grade_sub:"上",
                subject:"数学",
                version:"苏教版",
                grade_num:subjectInfo.grade_num
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
    _onChange:function(){
        var form_data = this.state.form_data;
        this.setState({
            chartDatas:SystemStore.getKnowledgeChartData(form_data.subject),
        })
    },
    _onNodes:function(chartIndex){
        this.setState({
            chartIndex:chartIndex
        })
    },
    _getDatasSource:function(){
        var index = this.state.chartIndex;
        var chartDatas = this.state.chartDatas;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(chartDatas.length > 0){
            return ds.cloneWithRows(chartDatas[index]);
        }else{
            return ds.cloneWithRows([]);
        }
    },
    _onSelsectedScetion:function(hash){
        History.pushRoute(hash);
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        return(
            <SectionsList rowData={rowData} onPress={this._onSelsectedScetion} />
        )
    },
    render:function(){
        var index = this.state.chartIndex;
        var chartIndex = this.state.chartIndex;
        var chartDatas = this.state.chartDatas;
        var title = chartDatas.length > 0?"第"+(index+1)+"章 "+chartDatas[index][0].chapter:"";
        var datas = this._getDatasSource();
        if(chartDatas.length > 0){
            var len = chartDatas.length;
        };
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
                                <ImageSelceted len={len} type="last" source={btn_last_press} chartIndex={chartIndex} onPress={this._onNodes} />
                                <View><Text style={styles.fontStyle}>{title}</Text></View>
                                <ImageSelceted len={len} type="next" source={btn_next_press} chartIndex={chartIndex} onPress={this._onNodes} />
                            </View>
                            <ScrollView style={styles.ScrollView}>
                                <ListView 
                                    enableEmptySections={true} 
                                    onEndReachedThreshold = {10}
                                    dataSource = {datas}
                                    renderRow = {this._onRenderRow}
                                />
                            </ScrollView>
                       </RowContainer>
                       <View style={styles.footer}>
                            <View style={styles.footerstyle}>
                                <View style={[styles.redStyle,styles.bankColor]}></View>
                                <View><Text>未掌握</Text></View>
                            </View>
                            <View style={styles.footerstyle}>
                                <View style={[styles.greenStyle,styles.bankColor]}></View>
                                <View><Text>已掌握</Text></View>
                            </View>
                            <View style={styles.footerstyle}>
                                <View style={[styles.yellowStyle,styles.bankColor]}></View>
                                <View><Text>掌握不劳</Text></View>
                            </View>
                            <View style={styles.footerstyle}>
                                <View style={[styles.noneStyle,styles.bankColor]}></View>
                                <View><Text>未学习</Text></View>
                            </View>
                       </View>
                </View>)
    }
});
        
var styles = StyleSheet.create({
    ScrollView:{
        height:Dimensions.screenHeight-Dimensions.toolBarHeight-Dimensions.tabBarHeight-Dimensions.size["86"]
    },
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
        fontSize:Dimensions.size["6"]
    },
    rowContainer:{
        paddingTop:Dimensions.size["10"],
        paddingRight:Dimensions.size["10"],
        paddingBottom:Dimensions.size["10"],
        paddingLeft:Dimensions.size["10"]
    },
    contentTitle:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        marginBottom:Dimensions.size["7"]
    },
    sectionView:{
        height: Dimensions.size["15"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        paddingLeft:Dimensions.size["5"],
        paddingRight:Dimensions.size["5"],
        marginBottom:Dimensions.size["9"],
        borderRadius:2
    },
    sectionStyle:{
        fontSize:Dimensions.size["6"]
    },
    Img:{
        width:Dimensions.size["10"],
        height:Dimensions.size["10"],
        marginRight: Dimensions.size["2"]
    },
    greenStyle:{
        backgroundColor: "#91DE74"
    },
    yellowStyle:{
       backgroundColor: "#FFC22D"
    },
    redStyle:{
       backgroundColor: "#FF7E60"
    },
    noneStyle:{
       backgroundColor: "#CCCCCC"
    },
    footer:{
        height:Dimensions.size["30"],
        paddingLeft:Dimensions.size["10"],
        paddingRight:Dimensions.size["10"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around"
    },
    footerstyle:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start"
    },
    bankColor:{
        width:Dimensions.size["7"],
        height:Dimensions.size["7"]
    }
})

module.exports = AnalysisPointView;