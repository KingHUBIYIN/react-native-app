'use strict'
var React = require('react');
var {
    Text,
    View
} = require('react-native')
var NavBars = require('../base/navbars');
var AnalysisPointView = React.createClass({
    render:function(){
        return (<View>
                       <NavBars name="/analysis/index/point" />
					   <View>
							<Text>{"这是点图"}</Text>
					   </View>
                </View>)
    }
})

module.exports = AnalysisPointView;