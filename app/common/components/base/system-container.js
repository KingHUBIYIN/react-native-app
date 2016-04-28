'use strict';
var React = require('react');
var {
  StyleSheet,
  View,
  Platform,
  Image
} = require('react-native');
    
var Dimensions = require('./react-native-dimensions');
var Platform = require('./react-native-platform');
var ColorUtils= require('../../utils/color-utils');
var WebAPIUtils = require('../../utils/web-api-utils');
    
var SystemContainer = React.createClass({
    render:function(){
        return (<View style={[styles.system,this.props.style]}>
                        {this.props.children}
                </View>)
    }
})
        
var ContentContainer = React.createClass({
    render:function(){
        return (<View style={[styles.content,ColorUtils.background,this.props.style]}>
                        {this.props.children}
                </View>)
    }
})
		
var RowContainer = React.createClass({
    render:function(){
        return (<View style={[styles.row,this.props.style]}>
                        {this.props.children}
                </View>)
    }
})
		
var Splitter = React.createClass({
    render:function(){
        return (<View style={[styles.splitter,this.props.style]}>
                        {this.props.children}
                </View>)
    }
})
		
var WebImage = React.createClass({
	render:function(){
		var {src,...props} = this.props;
		var imgSrc = WebAPIUtils.baseUrl+src;
		return(<Image source={{uri:imgSrc}} {...props}></Image>)
	}
})
        
var styles = StyleSheet.create({
    system:{
        marginTop:Platform.isIOS?Dimensions.statusBarHeight:0,
        height:Dimensions.contentHeight,
        width:Dimensions.screenWidth
    },
    content:{
        height:Dimensions.contentHeight,
        width:Dimensions.screenWidth,
		backgroundColor:"#ddd"
    },
	row:{
        width:Dimensions.screenWidth,
		backgroundColor:"#fff",
		borderBottomColor:"#d8d8d8",
		borderBottomWidth:1,
		borderStyle:"solid"
	},
	splitter:{
		height:1,
		width:Dimensions.screenWidth-Dimensions.size["4"],
		backgroundColor:"#d8d8d8",
		marginHorizontal:Dimensions.size["2"]
	}
})

module.exports.SystemContainer = SystemContainer;
module.exports.ContentContainer = ContentContainer;
module.exports.RowContainer = RowContainer;
module.exports.Splitter = Splitter;
module.exports.WebImage = WebImage;