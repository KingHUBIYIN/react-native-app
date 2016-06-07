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
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

//图片资料库
var btn_drop_down = require('../../images/btn_drop_down.png');
var btn_drop_up = require('../../images/btn_drop_up.png');

var HomeListView = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged:(s1,s2)=>s1!==s2});
        return {
            student_info: SystemStore.getSubjectByName(this.props.subject)
        }
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
     _onChange:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged:(s1,s2)=>s1!==s2});
        this.setState({
             student_info: SystemStore.getSubjectByName(this.props.subject)
        })
    },
    onNavIconPress:function(){
		History.popRoute();
	},
    _onWrongChoiceAll:function(){
        History.pushRoute("/wrong/index/" +this.props.subject + "/ChoiceAll");
    },
    _onWrongChoiceChapter:function(){
        History.pushRoute("/wrong/index/" +this.props.subject + "/ChoiceChapter");
    },
    render:function(){
        var student_info = this.state.student_info;
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<科目"}}  title={student_info.cn + "错题本"} onNavIconPress={this.onNavIconPress}></ToolBar>
                        <View style = {styles.titleText}>
                            <TouchableHighlight underlayColor = "#D8D8D8" onPress = {this._onWrongChoiceAll}>
                                <View style = {[styles.titleSelect,styles.bordStyle]}>
                                        <Text style = {styles.textSize}>全部</Text>
                                        <Image source = {btn_drop_down} style = {styles.imageStyle}/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor = "#D8D8D8" onPress = {this._onWrongChoiceChapter}>
                                <View style = {styles.titleSelect}>
                                        <Text style = {styles.textSize}>章节</Text>
                                        <Image source = {btn_drop_down}  style = {styles.imageStyle}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View>
                            {this.props.children}
                        </View>
                </ContentContainer>)
    }
});
        
    
var styles = StyleSheet.create({
    titleText:{
        height: Dimensions.size["20"],
        flexDirection:"row",
        alignItems:"center",
        borderStyle:"solid",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D8D8"
    },
    titleSelect:{
        width: Dimensions.screenWidth/2,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
    bordStyle:{
        borderStyle:"solid",
        borderRightWidth: 2,
        borderRightColor: "#D8D8D8"
    },
    textSize:{
        fontSize: Dimensions.size["7"],
    },
    imageStyle:{
        width: Dimensions.size["6"],
        height: Dimensions.size["6"],
        marginTop: Dimensions.size["2"],
        marginLeft: Dimensions.size["2"],
    }
});

module.exports = HomeListView;