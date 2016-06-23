var React = require('react');
var {Line,G,Text} = require('react-native-svg');
module.exports = React.createClass({
  displayName: 'YAxis',
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
        <G className="graphics-yaxis" >
            {
                data.map(function(ele,pos){
                    return (
                        <G className="yaxis" key={pos}>
                            <Line x1={ele.x1} y1={ele.y1} x2={ele.x2} y2={ele.y2} stroke={props.fill}></Line>
                            <Text textAnchor="end" x={ele.x1-5} y={ele.y1+6} fill={props.textColor}>{ele.name}</Text>
                        </G>
                    )
                })  
            }
        </G>
    );
  }
});
