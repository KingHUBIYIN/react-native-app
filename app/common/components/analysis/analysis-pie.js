'use strict'
var React = require('react');
var {
    Text,
    View,
	StyleSheet
} = require('react-native')
var NavBars = require('../base/navbars');
var PieChart = require('../charts/PieChart.react');
var SystemStore = require('../../stores/system-store');
var WebAPIActions = require('../../actions/web-api-actions');
var {EventTypes} = require('../../constants/system-constants');
var Dimensions = require('../base/react-native-dimensions');
var {width} = Dimensions;

var AnalysisPieView = React.createClass({
	getInitialState:function(){
		var subjectInfo = SystemStore.getSubjectByName('math');
		WebAPIActions.getAllExamInfo({ subject_id:subjectInfo.subject_id});
		return {
			data:SystemStore.getChartData(),
			subjectInfo:subjectInfo,
			pieIndex:0
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
		var pieIndex = this.state.pieIndex;
		var pieData = this.state.data.pie;
		var pieTitle = pieData[pieIndex].seriesName+"作业正确率";
		var pieValues = pieData[pieIndex].values;
		var pieSum = pieData[pieIndex].sum;
		
        return (<View>
                       <NavBars name="/analysis/index/pie" />
					  <View>
						   <View style={styles.pieContainer}>
							   <PieChart title={pieTitle} data={pieValues} radius={width*0.8} />
						  </View>
						   <View>
								{
									pieData.map(function(ele,pos){
										return (<View key={pos}><Text>{ele.seriesName}</Text></View>)
									})
								}
						   </View>
					 </View>
                </View>)
    }
})

var styles = StyleSheet.create({
	pieContainer:{
		paddingHorizontal:width*0.1,
		paddingVertical:width*0.1,
		backgroundColor:"#74C93C"
	}
})

module.exports = AnalysisPieView;