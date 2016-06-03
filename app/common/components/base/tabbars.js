var React = require('react');
var {
    Navigator,
} = require('react-native');

var router = require('../base/react-native-router');
var History = router.History;
var { TabBar,Tab } = require('../base/react-native-tabbar');

var ico_homework_normal = require('../../images/ico_homework_normal.png');
var ico_homework_select = require('../../images/ico_homework_select.png');
var ico_analysis_normal = require('../../images/ico_analysis_normal.png');
var ico_analysis_select = require('../../images/ico_analysis_select.png');
var ico_wrong_normal = require('../../images/ico_wrong_normal.png');
var ico_wrong_select = require('../../images/ico_wrong_select.png');
var ico_user_normal = require('../../images/ico_user_normal.png');
var ico_user_select = require('../../images/ico_user_select.png');
	
var TabBars = React.createClass({
    _onPress:function(e,name){
        if(this.props.name!=name){
            History.pushRoute(name,0,Navigator.SceneConfigs.FadeAndroid)
        }
    },
    render:function(){
        return (<TabBar barColor="#fff">
                        <Tab selected={this.props.name=="/home/index"} icon={ico_homework_normal} selectedIcon={ico_homework_select} name="/home/index" title="首页" onPress={this._onPress}></Tab>
                        <Tab selected={this.props.name.indexOf("/analysis/index")!=-1} icon={ico_analysis_normal} selectedIcon={ico_analysis_select}  name="/analysis/index/line"   title="分析" onPress={this._onPress}></Tab>
                        <Tab selected={this.props.name=="/wrong/index"} icon={ico_wrong_normal} selectedIcon={ico_wrong_select}  name="/wrong/index"  title="错题本" onPress={this._onPress}></Tab>
                        <Tab selected={this.props.name=="/user/index"} icon={ico_user_normal} selectedIcon={ico_user_select}  name="/user/index" title="我" onPress={this._onPress}></Tab>
                    </TabBar>)
    }
})

module.exports = TabBars;