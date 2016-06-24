'use strict'
var React = require('react');
var {
    Text,
    View,
	StyleSheet
} = require('react-native')
var NavBars = require('../base/navbars');
var LineChart = require('../charts/LineChart.react');
var SystemStore = require('../../stores/system-store');
var WebAPIActions = require('../../actions/web-api-actions');
var {EventTypes} = require('../../constants/system-constants');
var Dimensions = require('../base/react-native-dimensions');
var {width} = Dimensions;

var AnalysisLineView = React.createClass({
	getInitialState:function(){
		var subjectInfo = SystemStore.getSubjectByName('math');
		WebAPIActions.getAllExamInfo({ subject_id:subjectInfo.subject_id});
		return {
			data:SystemStore.getChartData(),
			subjectInfo:subjectInfo
		}
	},
	componentDidMount:function(){
		SystemStore.addChangeListener(EventTypes.RECEIVED_ALL_EXAM_INFO,this._onChange);
	},
	componentWillUnmout:function(){
		SystemStore.removeChangeListener(EventTypes.RECEIVED_ALL_EXAM_INFO,this._onChange);
	},
	_onChange:function(){
		this.setState({
			data:SystemStore.getChartData()
		})
	},
    render:function(){
		var data = this.state.data;
        return (<View>
                       <NavBars name="/analysis/index/line" />
					   <View  style={styles.lineContainer}>
							<LineChart datas={data.line} width={width} height={width}></LineChart>
					   </View>
					   <View  style={styles.footer}>
							<View style={styles.footerstyle}>
								<View style={[styles.redStyle,styles.bankColor]}></View>
								<Text>作业数据</Text>
							</View>
							<View style={styles.footerstyle}>
								<View style={[styles.greenStyle,styles.bankColor]}></View>
								<Text>考试数据</Text>
							</View>
						</View>
                </View>)
    }
})

var styles = StyleSheet.create({
	lineContainer:{
		marginTop:Dimensions.size["10"]
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

module.exports = AnalysisLineView;