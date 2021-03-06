var React = require('react');
var {Line,G,Text} = require('react-native-svg');
module.exports = React.createClass({
  displayName: 'XAxis',
  propTypes: {
    fill:React.PropTypes.string,
    data: React.PropTypes.array
  },
  getDefaultProps:function() {
    return {
        fill: "#cccccc",
        textColor:"#737373",
        data: []
    };
  },
  render:function() {
    var props = this.props;
    var data = props.data;
    return (
        <G className="graphics-xaxis" >
            {
                data.map(function(ele,pos){
                    return (
                        <G className="xaxis" key={pos}>
                            <Line x1={ele.x1} y1={ele.y1} x2={ele.x2} y2={ele.y2} stroke={props.fill}></Line>
                            <Text textAnchor="middle" x={ele.x1} y={ele.y2}  fill={props.textColor}>{ele.name.toString()}</Text>
                        </G>
                    )
                })  
            }
        </G>
    );
  }
});
