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
var WebAPIUtils = require('../../utils/web-api-utils');
var {ToggleButton} = require('../base/react-native-form');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var WrongChoiceAll = require('./wrong_choice_all');
var WrongChoiceChapter = require('./wrong_choice_chapter');
var WrongMain = require('./wrong_main');

//图片资料库
var btn_drop_down = require('../../images/btn_drop_down.png');
var btn_drop_up = require('../../images/btn_drop_up.png');

var Navbar = React.createClass({
    _onhandlePress:function(){
        if(this.props.onPress){
            this.props.onPress(this.props.type,false);
        }
    },
    _onhandletoggle:function(e,name,toggle){
        if(this.props.onPress){
            this.props.onPress(this.props.type,toggle);
        }
    },
    render:function(){
        var {style,title,onPress,type,...props} = this.props;
        return(
            <View style = {[styles.titleSelect,style]}>
                <TouchableOpacity onPress = {this._onhandlePress}><View style={{marginRight:Dimensions.size["4"]}}><Text style = {styles.textSize}>{title}</Text></View></TouchableOpacity>
                <ToggleButton icon={btn_drop_down} toggleIcon={btn_drop_up} style={styles.next} iconHeight={Dimensions.size["7"]} iconWidth={Dimensions.size["7"]} onPress={this._onhandletoggle}/>
            </View>
        )
    }
});

var HomeListView = React.createClass({
    getInitialState:function(){
        return {
            student_info: SystemStore.getSubjectByName(this.props.subject),
            form_data:{
                type: "choice_all",
                all_toggle: false,
                chapter_toggle:false,
                page:"answer_sheet",
                answer_sheet_id:null
            }
        }
    },
    componentDidMount:function(){
        SystemStore.addChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
    componentWillUnmount:function(){
        SystemStore.removeChangeListener(EventTypes.RECEIVED_STUDENT_META,this._onChange);
    },
     _onChange:function(){
        this.setState({
             student_info: SystemStore.getSubjectByName(this.props.subject)
        })
    },
    _onNavIconPress:function(){
		History.popRoute();
	},
    _onPress:function(answer_sheet_id){
        var form_data = this.state.form_data;
        form_data["answer_sheet_id"] = answer_sheet_id;
        form_data["page"] = "topics";
        this.setState({
            form_data:form_data
        });
    },
    _onGetData:function(){
        var form_data = this.state.form_data;
        if(form_data.page == "answer_sheet"){
            if(form_data.type == "choice_all"){
                return(<WrongChoiceAll subject={this.props.subject} toggle={form_data.all_toggle} onPress={this._onPress}/>)
            };
            if(form_data.type == "choice_chapter"){
                return(<WrongChoiceChapter subject={this.props.subject} toggle={form_data.chapter_toggle} onPress={this._onPress}/>)
            };
       }else{
           return(<WrongMain answer_sheet_id={form_data.answer_sheet_id} />)
       }
    },
    _onSelectContent:function(type,toggle){
        var form_data = this.state.form_data;
        form_data["page"] = "answer_sheet";
        if(type == "choice_all"){
            form_data["type"] = type;
            form_data["all_toggle"] = toggle;
        }else{
            form_data["type"] = type;
            form_data["chapter_toggle"] = toggle;
        }
        this.setState({
            form_data:form_data
        })
    },
    render:function(){
        var student_info = this.state.student_info;
        var onGetData = this._onGetData();
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<科目"}}  title={student_info.cn + "错题本"} onNavIconPress={this._onNavIconPress}></ToolBar>
                        <View style ={{backgroundColor: "#fff"}}>
                            <View style = {styles.titleText}>
                                <Navbar type="choice_all" title="全部" style={styles.bordStyle} onPress={this._onSelectContent} />
                                <Navbar type="choice_chapter" title="章节" onPress={this._onSelectContent} />                               
                            </View>
                            <View>
                                {onGetData}
                            </View>
                        </View>
                    </ContentContainer>)
    }
  });
        
    
var styles = StyleSheet.create({
    next:{
		width:Dimensions.size["8"],
		height:Dimensions.size["8"],
        marginTop: Dimensions.size["4"],
		paddingHorizontal:Dimensions.size["0"]
	},
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