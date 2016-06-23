'use strict'
var React = require('react');
var {
    Text,
    View
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
					   <View>
							<LineChart datas={data.line} width={width} height={width}></LineChart>
					   </View>
					   <View>
							<View>
								<View></View>
								<Text>作业数据</Text>
							</View>
							<View>
								<View></View>
								<Text>考试数据</Text>
							</View>
						</View>
                </View>)
    }
})
		
module.exports = AnalysisLineView;