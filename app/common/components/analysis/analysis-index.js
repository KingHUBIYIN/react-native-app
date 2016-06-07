'use strict'
var React = require('react');
var {
    Text,
    View,
    Navigator
} = require('react-native')
var Dimensions = require('../base/react-native-dimensions');
var {Link,History} = require('../base/react-native-router');
var TabBars = require('../base/tabbars');
var {ContentContainer} = require('../base/system-container')
var ToolBar = require('../base/react-native-toolbar');

var SystemStore = require('../../stores/system-store');
var {EventTypes} = require('../../constants/system-constants');

var AnalysisIndexView = React.createClass({
    render:function(){
        return (<ContentContainer>
                        {this.props.children}
                        <TabBars name="/analysis/index/line"></TabBars>
                </ContentContainer>)
    }
})

module.exports = AnalysisIndexView;