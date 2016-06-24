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
} = require('react-native');
var {Link,History} = require('../base/react-native-router');
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
                        <ScrollView style={styles.ScrollView}>
                            <RowContainer>
                                <View style={styles.knowledge}>
                                    <View><Text style={styles.fontStyle}>{this.props.points}</Text></View>
                                </View>
                                <View style={styles.blank}></View>
                                <View style={styles.Images}>
                                    <Image source={ico_chinese} style={styles.Img}/>
                                </View>
                                <View style={styles.blank1}></View>
                                <View style={styles.content}>
                                    <View style={styles.contentLeft}>
                                        <View style={styles.contentLeftItem}>
                                            <View style={styles.titleWidth}><Text style={styles.fontStyle1}>完成作业</Text></View>
                                            <View><Text style={styles.fontStyle1}>{this.props.A3}</Text></View>
                                            <View><Text style={styles.fontStyle1}>次</Text></View>
                                        </View>
                                        <View style={styles.contentLeftItem}>
                                            <View style={styles.titleWidth}><Text style={styles.fontStyle1}>完成考试</Text></View>
                                            <View><Text style={styles.fontStyle1}>{this.props.A4}</Text></View>
                                            <View><Text style={styles.fontStyle1}>次</Text></View>
                                        </View>
                                        <View style={styles.contentLeftItem}>
                                            <View style={styles.titleWidth}><Text style={styles.fontStyle1}>共</Text></View>
                                            <View><Text style={styles.fontStyle1}>{this.props.total}</Text></View>
                                            <View><Text style={styles.fontStyle1}>道</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.contentRight}>
                                    </View>
                                </View>
                            </RowContainer>
                        </ScrollView>
                </ContentContainer>)
    }
});
        

var styles = StyleSheet.create({
    ScrollView:{
        height:Dimensions.screenHeight-Dimensions.toolBarHeight-Dimensions.tabBarHeight
    },
    content:{
        paddingLeft: Dimensions.size["12"],
        paddingRight: Dimensions.size["12"],
        paddingTop: Dimensions.size["10"],
        paddingBottom: Dimensions.size["10"],
        marginBottom:Dimensions.size["30"],
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
        justifyContent:"flex-start"
    },
    fontStyle:{
        fontSize: Dimensions.size["7"]
    },
    fontStyle1:{
        fontSize: Dimensions.size["6"]
    },
    titleWidth:{
        width:Dimensions.size["25"],
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end"
    },
    Images:{
        paddingTop:Dimensions.size["4"],
        paddingRight:Dimensions.size["10"],
        marginBottom:Dimensions.size["4"],
        paddingLeft:Dimensions.size["10"]
    },
    Img:{
        width: Dimensions.screenWidth-Dimensions.size["20"],
        height: Dimensions.size["80"]
    },
    blank:{
        marginLeft:Dimensions.size["5"],
        marginRight:Dimensions.size["5"],
        backgroundColor: "#ddd",
        height:1
    },
    blank1:{
        marginLeft:Dimensions.size["8"],
        marginRight:Dimensions.size["8"],
        backgroundColor: "#ddd",
        height:1
    }
})
        
        
module.exports = AnalysisPointDetail;