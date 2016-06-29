'use strict'
var React = require('react');
var {
    ListView,
    View,
    Text,
	RecyclerViewBackedScrollView,
	StyleSheet,
    Alert,
    Image,
    PanResponder,
    StatusBar,
    TouchableOpacity,
    TouchableHighlight
} = require('react-native');
var TabBars = require('../base/tabbars');
var {ContentContainer,RowContainer}  = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');
var { Link,History } = require('../base/react-native-router');
var { Button,TextInput } = require('../base/react-native-form');
var Dimensions = require('../base/react-native-dimensions');
var WebAPIUtils = require('../../utils/web-api-utils');

var WebAPIActions = require('../../actions/web-api-actions');
var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

//引导页图片资源
var Guidepage_1 = require('../../images/Guidepage_1.jpg');
var Guidepage_2 = require('../../images/Guidepage_2.jpg');
var Guidepage_3 = require('../../images/Guidepage_3.jpg');
var guide_array=[Guidepage_1,Guidepage_2,Guidepage_3];

var GuidePages = React.createClass({
    getInitialState:function(){
        return {
           page_num: 0,
           guide_array:guide_array
        }
    },
    componentWillMount() {
        var _self = this;
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (e, gestureState)=>_self._handleStartShouldSetPanResponder(e, gestureState),
          onMoveShouldSetPanResponder: (e, gestureState)=>_self._handleMoveShouldSetPanResponder(e, gestureState),
          onPanResponderGrant: (e, gestureState)=>_self._handlePanResponderGrant(e, gestureState),
          onPanResponderMove: (e, gestureState)=>_self._handlePanResponderMove(e, gestureState),
          onPanResponderRelease: (e, gestureState)=>_self._handlePanResponderEnd(e, gestureState)
        })
    },
     _handleStartShouldSetPanResponder:function(e: Object, gestureState: Object): boolean {
        return true
    },
    _handleMoveShouldSetPanResponder:function(e: Object, gestureState: Object): boolean {
       return true
    },
    _handlePanResponderGrant:function(e: Object, gestureState: Object) {},
    _handlePanResponderMove:function(e: Object, gestureState: Object) {},
    _handlePanResponderEnd:function(e: Object, gestureState: Object) {
          var dx = gestureState.dx;
          var dy = gestureState.dy;
          var absDx = dx>0?dx:-dx;
          var absDy = dy>0?dy:-dy;
          var moveX = (absDx / Dimensions.screenWidth)*100;
          var page_num = this.state.page_num;
          if(dx < 0 && moveX > 20){
            if(page_num == 2){
                page_num = 0;
            }else{
                page_num = page_num +1;
            };
            this.setState({
                page_num: page_num
            });
          }
          if(dx > 0 && moveX > 20){
            if(page_num == 0){
                page_num = 2;
            }else{
                page_num = page_num -1;
            };
            this.setState({
                page_num: page_num
            });
          }
    },
    onHandleOpress:function(){
        SystemStore.setGuidePage();
        History.pushRoute("/user/login");
    },
    render:function(){
        var page_num = this.state.page_num;
        var guide_array = this.state.guide_array;
        return(
            <View>
                <StatusBar hidden={true} />
                <View {...this._panResponder.panHandlers} >
                    <Image source={guide_array[page_num]} style={styles.imagestyle} />
                </View>
                <TouchableOpacity  style={styles.bottonStyle} onPress={this.onHandleOpress}>
                    <View><Text style={styles.fontStyle}></Text></View>
                </TouchableOpacity>
            </View>
        )
    }
});

var styles = StyleSheet.create({
  imagestyle:{
      width:Dimensions.screenWidth,
      height:Dimensions.screenHeight
  },
  bottonStyle:{
    width:Dimensions.screenWidth,
    height:Dimensions.size["20"],
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    position:"absolute",
    left:0,
    right:0,
    bottom:0
  },
  fontStyle:{
      fontSize:Dimensions.size["6"]
  }
});

module.exports = GuidePages;