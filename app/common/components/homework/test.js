'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
    StyleSheet
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var AnswerSheet = React.createClass({
    render:function(){
        var answer_sheet = this.props.answer_sheet;
        var key = this.props.key;
        return(
            <View key = {key}>
                 <View style = {styles.time}><Text style = {styles.text}>{answer_sheet.key}</Text></View>
                 <View>
                 </View>
            </View>
        )
    }
});

var HomeListView = React.createClass({
    getInitialState:function(){
        return {
            answer_sheets: SystemStore.getAnswerSheets(this.props.subject),
            student_info: SystemStore.getSubjectByName(this.props.subject)
        }
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_ALL_DATA,this._onChange);
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_ALL_DATA,this._onChange);
        SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    _onChange:function(){
        this.setState({
             answer_sheets: SystemStore.getAnswerSheets(this.props.subject),
             student_info: SystemStore.getSubjectByName(this.props.subject)
        })
    },
    render:function(){
        var answer_sheets = this.state.answer_sheets;
        var student_info = this.state.student_info;
        if(answer_sheets.length > 0){
           return (
                  <ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View></View>
                        <TabBars name="/home/index"></TabBars>
                </ContentContainer>)
        }
        if(answer_sheets.length == 0){
            return (
                   <ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View style = {styles.loading}>
                            <Text>{"Loading......"}</Text>
                        </View>
                        <TabBars name="/home/index"></TabBars>
                  </ContentContainer>)
        }
    }
});
        
var styles = StyleSheet'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator,
    StyleSheet
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var AnswerSheet = React.createClass({
    render:function(){
        var answer_sheet = this.props.answer_sheet;
        var key = this.props.key;
        return(
            <View key = {key}>
                 <View style = {styles.time}><Text style = {styles.text}>{answer_sheet.key}</Text></View>
                 <View>
                 </View>
            </View>
        )
    }
});

var HomeListView = React.createClass({
    getInitialState:function(){
        return {
            answer_sheets: SystemStore.getAnswerSheets(this.props.subject),
            student_info: SystemStore.getSubjectByName(this.props.subject)
        }
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_ALL_DATA,this._onChange);
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_ALL_DATA,this._onChange);
        SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    _onChange:function(){
        this.setState({
             answer_sheets: SystemStore.getAnswerSheets(this.props.subject),
             student_info: SystemStore.getSubjectByName(this.props.subject)
        })
    },
    render:function(){
        var answer_sheets = this.state.answer_sheets;
        var student_info = this.state.student_info;
        if(answer_sheets.length > 0){
           return (
                  <ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View></View>
                        <TabBars name="/home/index"></TabBars>
                </ContentContainer>)
        }
        if(answer_sheets.length == 0){
            return (
                   <ContentContainer>
                        <ToolBar navIcon={{title:"<返回"}}  title={student_info.cn} onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View style = {styles.loading}>
                            <Text>{"Loading......"}</Text>
                        </View>
                        <TabBars name="/home/index"></TabBars>
                  </ContentContainer>)
        }
    }
});
        
var styles = StyleSheet.create({
    loading:{
        width: Dimensions.screenWidth,
        justifyContent: "flex-start",
        fontSize: Dimensions.size["32"]
    },
    time:{
        paddingTop: Dimensions.size["5"],
        paddingLeft: Dimensions.size["8"],
        flexDirection:"row",
        justifyContent: "flex-start"
    },
    text:{
        width: Dimensions.size["32"],
        height: Dimensions.size["10"]
    }
})

module.exports = HomeListView;