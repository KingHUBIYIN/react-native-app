'use strict'
var React = require('react');
var {
    View,
    ListView,
    WebView,
    StyleSheet
} = require('react-native');
var Dimensions = require('../base/react-native-dimensions');
var {RadioSelect} = require('../base/react-native-form');
var ReactNativeWebview = require('../base/react-native-webview');
var Radio = React.createClass({
    _onhandleClick:function(option,topic_id){
        var selected = option;
        if(this.props.onPress){
            this.props.onPress(option,topic_id,selected);
        }
    },
    render:function(){
        var {rowData,selected,onPress,...props} = this.props;
        return(
            <View style = {styles.answer}>
                <RadioSelect option={rowData.option} topicID = {rowData.topic_id} selected = {rowData.selected} onPress={this._onhandleClick} style = {{marginLeft: Dimensions.size["12"],marginRight: Dimensions.size["5"]}}/><ReactNativeWebview name = {rowData.raw} style = {styles.webViewSelsct} />
            </View>
        )
    }
});
    
var RadioGroup = React.createClass({
    _getAnswers:function(){
         var ds = new ListView.DataSource({rowHasChanged: (r1, r2) =>{ r1.selected !== r2.selected } });
         var topic_options = !!this.props.rowData.topic_options?this.props.rowData.topic_options:[];
         return ds.cloneWithRows(topic_options);
    },
    _onSelectOption:function(option,topic_id,selected){
        if(this.props.onPress){
            this.props.onPress(option,topic_id,selected);
        };
    },
    _onRenderRow:function(rowData,sectionID,rowID){
        var {onPress,...props} = this.props;
        return(
            <Radio rowData = {rowData} onPress = {this._onSelectOption} />
        )
    },
    render:function(){
        var answers = this._getAnswers();
        return(
            <ListView 
                enableEmptySections={true} 
                dataSource = {answers}
                renderRow = {this._onRenderRow}
            />
        )
    }
});

var styles = StyleSheet.create({
    webViewSelsct:{
        height: 50
    },
    answer:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    }
})

module.exports = RadioGroup;