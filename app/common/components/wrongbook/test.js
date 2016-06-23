'use strict';
var React = require('react');
var {
  PanResponder,
  StyleSheet,
  View,
  Text,
  processColor,
  Alert,
  Animated
} =  require('react-native');
var Dimensions = require('../base/react-native-dimensions');

class FadeInView extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       fadeAnim: new Animated.Value(0),
     };
   }
   componentDidMount() {
     Animated.timing(
       this.state.fadeAnim,
       {toValue: 1}, 
     ).start();
   }
   render() {
     return (
       <Animated.View 
         style={{opacity: this.state.fadeAnim}}>
         <Text>测试</Text>
       </Animated.View>
     );
   }
 }

module.exports = FadeInView;