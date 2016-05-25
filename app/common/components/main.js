'use strict'
var React = require('react');
var {
  View,
  Text,
  Navigator,
  StyleSheet,
  Dimensions,
  ListView,
  Alert
} = require('react-native')

var {height, width} = Dimensions.get('window');
// home work
var HomeView = require('./homework/home')
var HomeIndexView = require('./homework/home-index')
var HomeListView = require('./homework/home-list')
var HomeTopicView = require('./homework/home-topic-list')
var HomeTopicDetails = require('./homework/home-topic-details')
// analysis
var AnalysisView = require('./analysis/analysis')
var AnalysisIndexView = require('./analysis/analysis-index')
var AnalysisLineView = require('./analysis/analysis-line')
var AnalysisPointView = require('./analysis/analysis-point')
var AnalysisPointDetails = require('./analysis/analysis-point-details')
var AnalysisPieView = require('./analysis/analysis-pie')
// wrong book
var WrongView = require('./wrongbook/wrong');
var WrongIndexView = require('./wrongbook/wrong-index');
var WrongPracticeView = require('./wrongbook/wrong-practice');
var WrongTopicView = require('./wrongbook/wrong-topic');
var WrongSubjectView = require('./wrongbook/subject-list');
var WrongPracticeEnd = require('./wrongbook/practice-end');
// user
var UserView = require('./user/user')
var UserIndexView = require('./user/user-index')
var UserLoginView = require('./user/user-login')
var UserWelcomeView = require('./user/user-welcome')
var UserInfoView = require('./user/user-info')
var UserHelpView = require('./user/user-help')

// user setting
var UserSettingsView = require('./user_settings/settings')
var UserSettingsIndex = require('./user_settings/settings-index')
var UserUpdatePwdView = require('./user_settings/update-pwd')
var UserFeedBackView = require('./user_settings/feedback')
var UserAboutUsView = require('./user_settings/aboutus')
// other form
var FormView = require('./form/form')
var FormAddress =  require('./form/form-address')
var FormSelection = require('./form/form-selection')
var FormDatePicker = require('./form/form-datepicker')

var {Route,Router,History} = require('./base/react-native-router')
var SystemStore = require('../stores/system-store')
var {EventTypes} = require('../constants/system-constants')

var WebAPIUtils = require('../utils/web-api-utils')
//进入系统请求全部数据
WebAPIUtils.getAllData();
WebAPIUtils.getStudentMeta();


var MainApp = React.createClass({
    render:function(){
        return (<View style={styles.main}>
                {this.props.children}
            </View>)
    }
})

var RouterApp = React.createClass({
    render:function() {
        return (<Router defaultRoute="/user/welcome" path="/" component={MainApp}>
                        <Route component={HomeView} path="home">
                                <Route component={HomeIndexView} path="index"></Route>
								<Route component={HomeListView} path="list/:subject"></Route>
								<Route component={HomeTopicView} path="topic"></Route>
								<Route component={HomeTopicDetails} path="details"></Route>
                        </Route>
                        <Route component={AnalysisView} path="analysis">
                                <Route component={AnalysisIndexView} path="index"></Route>
								<Route component={AnalysisLineView} path="line"></Route>
								<Route component={AnalysisPointView} path="point"></Route>
								<Route component={AnalysisPointDetails} path="details"></Route>
								<Route component={AnalysisPieView} path="pie"></Route>
                        </Route>
                        <Route component={WrongView} path="wrong">
                                 <Route component={WrongIndexView} path="index"></Route>
								 <Route component={WrongPracticeView} path="practice"></Route>
								 <Route component={WrongTopicView} path="topic"></Route>
								 <Route component={WrongSubjectView} path="subject"></Route>
								 <Route component={WrongPracticeEnd} path="practice"></Route>
                        </Route>
                        <Route component={UserView} path="user">
                                <Route component={UserIndexView} path="index"></Route>
								<Route component={UserLoginView} path="login"></Route>
                                <Route component={UserWelcomeView} path="welcome"></Route>
	                            <Route component={UserInfoView} path="info"></Route>
								<Route component={UserHelpView} path="help"></Route>
                        </Route>
                        <Route component={UserSettingsView} path="settings">
                                <Route component={UserSettingsIndex} path="index"></Route>
								<Route component={UserUpdatePwdView} path="password"></Route>
	                            <Route component={UserFeedBackView} path="feedback"></Route>
								<Route component={UserAboutUsView} path="aboutus"></Route>
                        </Route>
						<Route component={FormView} path="form">
							<Route component={FormAddress} path="msg"></Route>
							<Route component={FormSelection} path="select"></Route>
							<Route component={FormDatePicker} path="datepicker"></Route>
						</Route>
                </Router>)
    },
})
        
var styles = {
    main:{
        height:height,
        width:width
    }
}

module.exports = RouterApp;