var React = require('react');
var {Path} = require('react-native-svg');
module.exports = React.createClass({
  displayName: 'Line',
  propTypes: {
    fill:React.PropTypes.string,
    data: React.PropTypes.array
  },
  getDefaultProps:function() {
    return {
        fill: "#cccccc",
        data: []
    };
  },
  render:function() {
    var props = this.props;
    var data = props.data;
    var first = {
        x:data[0]?data[0].x:0,
        y:data[0]?data[0].y:0
    }
    var pathData = ["M"+first.x+","+first.y];
    for(var i=1;i<data.length;i++){
        pathData.push("L"+data[i].x+","+data[i].y);
    }
    return (
        <Path d={pathData.join("")} stroke={props.fill} strokeWidth="1" fill="none"></Path>
    );
  }
});
