'use strict'
var React = require('react');
var {
    Text,
    View
} = require('react-native')
var NavBars = require('../base/navbars');
var AnalysisLineView = React.createClass({
    render:function(){
        return (<View>
                       <NavBars name="/analysis/index/line" />
					   <View>
							<Text>{"这是折线图"}</Text>
					   </View>
                </View>)
    }
})

module.exports = AnalysisLineView;