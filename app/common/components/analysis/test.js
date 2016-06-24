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
var {ContentContainer,RowContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

//图片资源
var ico_chinese = require("../../images/ico_chinese.png");

var AnalysisPointDetail = React.createClass({
    onNavIconPress:function(){
		History.popRoute();
	},
    render:function(){
        return (<ContentContainer>
                        <ToolBar navIcon={{title:"<图谱"}}  title="知识点详情" onNavIconPress={this.onNavIconPress}></ToolBar>
                        <RowContainer>
                            <View style={styles.knowledge}>
                                <View><Text style={styles.fontStyle}>相反数</Text></View>
                            </View>
                            <View style={styles.Images}>
                                <Image source={ico_chinese} />
                            </View>
                            <View style={styles.blank}></View>
                            <View style={styles.content}>
                                <View style={styles.contentLeft}>
                                </View>
                                <View style={styles.contentRight}>
                                </View>
                            </View>
                        </RowContainer>
                </ContentContainer>)
    }
});
        

var styles = StyleSheet.create({
    content:{
        paddingLeft: Dimensions.size["18"],
        paddingRight: Dimensions.size["18"],
        paddingTop: Dimensions.size["25"],
        paddingRight: Dimensions.size["10"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start"
    },
    contentLeft:{
        width: (Dimensions.screenWidth-Dimensions.size["36"])/2
    },
    contentLeftItem:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginBottom: Dimensions.size["7"]
    },
    contentRight:{
        width: (Dimensions.screenWidth-Dimensions.size["36"])/2
    },
    knowledge:{
        height: Dimensions.size["22"],
        paddingLeft: Dimensions.size["5"],
        paddingRight: Dimensions.size["5"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start",
        borderStyle:"solid",
        borderBottomWidth:1,
        borderColor: "#ddd"
    },
    fontStyle:{
        fontSize: Dimensions.size["7"]
    },
    Images:{
        paddingTop:Dimensions.size["4"],
        paddingRight:Dimensions.size["10"],
        marginBottom:Dimensions.size["4"],
        paddingLeft:Dimensions.size["10"]
    },
    blank:{
        paddingLeft:Dimensions.size["8"],
        paddingRight:Dimensions.size["8"],
        backgroundColor: "#ddd",
        height:1
    }
})
        
        
module.exports = AnalysisPointDetail;