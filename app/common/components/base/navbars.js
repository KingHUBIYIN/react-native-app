var React = require('react');
var {
    Navigator,
	StyleSheet
} = require('react-native');

var router = require('../base/react-native-router');
var History = router.History;
var Dimensions = require('./react-native-dimensions');
var { Navbar,NavbarItem } = require('../base/react-native-navbar');
	
var NavBars = React.createClass({
    _onPress:function(e,name){
        if(this.props.name!=name){
            History.pushRoute(name,0,Navigator.SceneConfigs.FadeAndroid)
        }
    },
    render:function(){
        return (<Navbar style={styles.navbar}>
						<NavbarItem selected={this.props.name=="/analysis/index/line"} name="/analysis/index/line" title="学习曲线" onPress={this._onPress} selectedStyle={styles.selectedItem} defaultStyle={styles.defaultItem} titleStyle={styles.itemTitle}/>
						<NavbarItem selected={this.props.name=="/analysis/index/pie"} name="/analysis/index/pie" title="正确率" onPress={this._onPress} selectedStyle={styles.selectedItem} defaultStyle={styles.defaultItem} titleStyle={styles.itemTitle}/>
						<NavbarItem selected={this.props.name=="/analysis/index/point"} name="/analysis/index/point" title="知识图谱" onPress={this._onPress} selectedStyle={styles.selectedItem} defaultStyle={styles.defaultItem} titleStyle={styles.itemTitle}/>
                    </Navbar>)
    }
})
		
var styles = StyleSheet.create({
	navbar:{
		backgroundColor:'#74C93C',
		height:Dimensions.size["20"]
	},
	selectedItem:{
		borderBottomWidth:Dimensions.size["1"],
		borderBottomColor:"#FFFFFF",
		borderStyle:"solid",
		marginHorizontal:Dimensions.size["2"]
	},
	defaultItem:{
		borderBottomWidth:Dimensions.size["1"],
		borderBottomColor:"transparent",
		borderStyle:"solid",
		marginHorizontal:Dimensions.size["4"]
	},
	itemTitle:{
		color:"#fff",
		textAlign:"center",
        fontSize: Dimensions.size["6"]
	}
})

module.exports = NavBars;