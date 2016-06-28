'use strict'
var React = require('react');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} = require('react-native');
var Dimensions = require('./react-native-dimensions');
var {height, width} = Dimensions.get('window');

var NavbarItem = React.createClass({
	handlePress:function(e){
		var name = this.props.name;
		if(this.props.onPress){
			this.props.onPress(e,name);
		}
	},
	render:function(){
		var {title,style,onPress,...props,name,selected,selectedStyle,defaultStyle,titleStyle} = this.props;
		var _style = selected?selectedStyle:defaultStyle;
		return (<TouchableOpacity {...props} onPress={this.handlePress} style={[styles.item,style,_style]}>
			<Text style={[styles.itemTitle,titleStyle]}>{title}</Text>
		</TouchableOpacity>)
	}
})
		
var Navbar = React.createClass({
	render:function(){
		var {style,...props} = this.props;
		return (<View style={[styles.navbar,style]}>{this.props.children}</View>)
	}
})

var styles = StyleSheet.create({
	navbar:{
		flexDirection:"row",
		justifyContent:"center",
		alignItems:'center'
	},
	item:{
		flex:1,
		flexDirection:"row",
		justifyContent:"center",
		alignItems:'center',
        height:Dimensions.size["16"]
	},
    itemTitle:{
		flex:1
	}
})

module.exports = {
	NavbarItem:NavbarItem,
	Navbar:Navbar
}