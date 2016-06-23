var React = require('react');
var d3 = require('d3');
var  {
    G,
    Path,
} =  require('react-native-svg');


module.exports = React.createClass({
  displayName: 'Arc',
  propTypes: {
    backgroundColor:React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number
  },
  getDefaultProps:function() {
    return {
        startAngle: 0,
        endAngle: 2*Math.PI,
        innerRadius: 200,
        outerRadius: 240,
        backgroundColor:"#91DE74"
    };
  },
  render:function() {
    var props = this.props;

    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);
    return (
      React.createElement(G, {className: "piechart-arc"}, 
        React.createElement(Path, {
          d: arc(), 
          fill: props.backgroundColor, 
          stroke: props.backgroundColor, 
          onMouseOver: props.handleMouseOver, 
          onMouseLeave: props.handleMouseLeave}), null
      )
    );
  }
});
