var React = require('react');
var Arc = require('./Arc.react');
var {Svg,G,Text} = require('react-native-svg');
var Dimensions = require('../base/react-native-dimensions');
module.exports = React.createClass({
      displayName: 'PieChart',
      getChartData:function(){
        var props = this.props;
        var startAngle = 0,endAngle=0;
        var chartData = props.data.map(function(ele,pos){
            startAngle = endAngle;
            endAngle = startAngle+ele.percent*Math.PI*2;
            return {
                percent:ele.percent,
                startAngle:startAngle,
                endAngle:endAngle,
                backgroundColor:ele.color?ele.color:props.colors[pos%props.colors.length]
            }
        });
        return chartData;
      },
      render:function() {
        var props = this.props;
        var chartData = this.getChartData();
        var arcs = chartData.map(function(ele,pos){
            return (
                React.createElement(Arc,{
                    "key":""+ele.startAngle+"-"+ele.endAngle,
                    "startAngle":ele.startAngle?ele.startAngle:0,
                    "endAngle":ele.endAngle?ele.endAngle:0,
                    "backgroundColor":ele.backgroundColor, 
                    innerRadius:0,
                    outerRadius:Dimensions.size["25"]
                },null)
            )
        });
        
        return (
            <Svg className="piechart" width={Dimensions.size["50"]} height={Dimensions.size["50"]} >
                <G className="piechart-pie" x={Dimensions.size["50"]/4} y={Dimensions.size["50"]/4}>
                    {arcs}
                    <G className="piechart-txts" width={Dimensions.size["50"]/4} y={Dimensions.size["50"]/4}>
                        <Text className="txts-value" y={-10} x={Dimensions.size["50"]/4} textAnchor="middle" fontSize="22"  fill="#fff" >{chartData[0].percent?chartData[0].percent*100+"%":"未作检测"}</Text>
                    </G>
                </G>
            </Svg>
        );
      }
});