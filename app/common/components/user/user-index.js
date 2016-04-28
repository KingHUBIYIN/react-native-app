'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
	StyleSheet,
	Image
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer,Splitter,WebImage} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');
var ColorUtils = require('../../utils/color-utils');
var WebAPIActions = require('../../actions/web-api-actions');

var btn_next_normal = require('../../images/btn_next_normal.png');
var ico_help = require('../../images/ico_help.png');
var ico_set = require('../../images/ico_set.png');

var UserIndexView = React.createClass({
	getInitialState:function(){
		return {
			student_info:SystemStore.getStudentInfo()
		}
	},
	componentWillMount:function(){
		WebAPIActions.getStudentInfo();
	},
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_INFO,this.handleStudentInfoSuccess);
    },
    componentWillUnmount:function(){
         SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_INFO,this.handleStudentInfoSuccess);
    },
	handleStudentInfoSuccess:function(){
		this.setState({
			student_info:SystemStore.getStudentInfo()
		})
	},
    render:function(){
		var student_info = this.state.student_info;
		var student = student_info.student ? student_info.student : {};
		var avatar = student.avatar?student.avatar:"/static/images/iconfont-ren.png";
		var class_data = student_info.class_data?student_info.class_data : {};
		var school = student_info.school?student_info.school:{};
        return (<ContentContainer>
                        <ToolBar title="我的信息" ></ToolBar>
                        <RowContainer style={styles.row}>
							 	<Link name="/user/info" style={styles.infoLink}>
										<WebImage src={avatar} style={styles.infoImg} />
										<View style={styles.userRow}>
											<Text style={[ColorUtils.text2,styles.name]}>{student.name}</Text>
											<Text style={[ColorUtils.text8,styles.school]}>{school.name}</Text>
										</View>
										<Image source={btn_next_normal} style={styles.next}/>
								</Link>	
						</RowContainer>   
						<RowContainer style={styles.row}>
							 	<Link name="/user/help" style={styles.link}>
										<Image source={ico_help} style={styles.icon}/>
										<View style={styles.textRow}>
											<Text style={[ColorUtils.text3,styles.text]}>帮助</Text>
										</View>
										<Image source={btn_next_normal} style={styles.next}/>
								</Link>	
								<Splitter />
							 	<Link name="/settings/index" style={styles.link}>
										<Image source={ico_set} style={styles.icon}/>
										<View style={styles.textRow}>
											<Text style={[ColorUtils.text3,styles.text]}>设置</Text>
										</View>
										<Image source={btn_next_normal} style={styles.next}/>
								</Link>	
						</RowContainer>
                        <TabBars name="/user/index"></TabBars>
                </ContentContainer>)
    }
})
		
var styles = StyleSheet.create({
	row:{
		marginTop:Dimensions.size["5"]
	},
	infoLink:{
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center",
		paddingHorizontal:Dimensions.size["10"],
		height:Dimensions.size["45"]
	},
	infoImg:{
		width:Dimensions.size["30"],
		height:Dimensions.size["30"]
	},
	userRow:{
		width:Dimensions.screenWidth-Dimensions.size["48"],
		flexDirection:"column",
		justifyContent:"flex-start",
		paddingLeft:Dimensions.size["5"]
	},
	name:{
		fontSize:Dimensions.size["10"]
	},
	school:{
		fontSize:Dimensions.size["6"]
	},
	next:{
		width:Dimensions.size["8"],
		height:Dimensions.size["8"]
	},
	link:{
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center",
		paddingHorizontal:Dimensions.size["10"],
		height:Dimensions.size["22"]
	},
	icon:{
		width:Dimensions.size["10"],
		height:Dimensions.size["10"],
		marginLeft:Dimensions.size["5"],
	},
	textRow:{
		width:Dimensions.screenWidth-Dimensions.size["32"],
		flexDirection:"column",
		justifyContent:"flex-start",
		paddingLeft:Dimensions.size["5"]
	},
	text:{
		fontSize:Dimensions.size["8"]
	}
})

module.exports = UserIndexView;