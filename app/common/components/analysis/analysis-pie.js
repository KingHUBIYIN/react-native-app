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
var {TouchableOpacity} = require('../base/react-native-form');
var {width} = Dimensions;

var SeriesNameButton = React.createClass({
	handlePress:function(){
		if(this.props.onPress){
			this.props.onPress(this.props.index);
		}
	},
	render:function(){
		var {seriesName,viewStyle,textStyle} = this.props;
		return (<TouchableOpacity style={viewStyle} onPress={this.handlePress}>
					<View>
						<Text style={textStyle}>{seriesName}</Text>
					</View>
				</TouchableOpacity>)
	}
})

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
	handlePress:function(index){
		this.setState({
			pieIndex: index
		})
	},
    render:function(){
		var pieIndex = this.state.pieIndex;
		var pieData = this.state.data.pie;
		var pieTitle = pieData[pieIndex].seriesName+"作业正确率";
		var pieValues = pieData[pieIndex].values;
		var pieSum = pieData[pieIndex].sum;
		var handlePress = this.handlePress;
        return (<View>
                       <NavBars name="/analysis/index/pie" />
					  <View>
						   <View style={styles.pieContainer}>
							   <PieChart title={pieTitle} data={pieValues} radius={width*0.8} />
						  </View>
						   <View style={styles.seriesContainer}>
								{
									pieData.map(function(ele,pos){
										var viewStyle = pos==pieIndex?{backgroundColor:"#83c93c"}:{};
										var textStyle = pos == pieIndex?{color:"#fff"}:{};
										return (<SeriesNameButton index={pos} key={pos} viewStyle={[styles.seriesView,viewStyle]} textStyle={[styles.seriesText,textStyle]} onPress={handlePress} seriesName={ele.seriesName}></SeriesNameButton>)
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
	},
	seriesContainer:{
		flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around",
		marginTop:Dimensions.size["20"],
		marginHorizontal: Dimensions.size["10"]
	},
	seriesView:{
		borderWidth:1,
		borderStyle:"solid",
		borderColor:"#83c93c",
		paddingHorizontal:Dimensions.size["6"],
		paddingVertical:Dimensions.size["2"]
	},
	seriesText:{
		color:"#000"
	}
})

module.exports = AnalysisPieView;