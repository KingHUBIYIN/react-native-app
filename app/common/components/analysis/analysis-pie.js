'use strict'
var React = require('react');
var {
    Text,
    View
} = require('react-native')
var NavBars = require('../base/navbars');
var AnalysisPieView = React.createClass({
    render:function(){
        return (<View>
                       <NavBars name="/analysis/index/pie" />
					   <View>
							<Text>{"这是饼图"}</Text>
					   </View>
                </View>)
    }
})

module.exports = AnalysisPieView;