var React = require('react');
var Arc = require('./Arc.react');
var {Svg,G,Text} = require('react-native-svg');
module.exports = React.createClass({
      displayName: 'PieChart',
      propTypes: {
        data:React.PropTypes.array,
        colors: React.PropTypes.array,
        radius:React.PropTypes.number,
      },
      getDefaultProps:function() {
        return {
            data: [20,16,14],
            colors: ["#91DE74","#FF7E60","#CCCCCC"],
            radius:400
        };
      },
      getDataSum:function(){
          var props = this.props;
          var sum = 0;
          for(var i=0;i<props.data.length;i++){
              var ele = props.data[i];
              var number = ele instanceof Number?ele:ele.value;
              sum += number;
          }
          return sum;
      },
      getChartData:function(){
        var props = this.props;
        var sum = this.getDataSum();
        var startAngle = 0,endAngle=0;
        var chartData = props.data.map(function(ele,pos){
            var number = ele instanceof Number?ele:ele.value;
            var percent = number/sum;
            startAngle = endAngle;
            endAngle = startAngle+percent*Math.PI*2;
            return {
                sum:sum,
                percent:Math.round(percent*100),
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
                    "startAngle":ele.startAngle,
                    "endAngle":ele.endAngle,
                    "backgroundColor":ele.backgroundColor, 
                    innerRadius:props.radius/2-40,
                    outerRadius:props.radius/2
                },null)
            )
        });
        
        return (
            <Svg className="piechart" width={props.radius} height={props.radius} >
                <G className="piechart-pie" x={props.radius/4} y={props.radius/4}>
                    {arcs}
                    <G className="piechart-txts">
                            <Text className="txts-title" y={-props.radius/5 } style={{"textAnchor":"middle","fontSize":"20px","fill":"#737373"}}>{props.title}</Text>
                            <Text className="txts-value" y={25} style={{"textAnchor":"middle","fontSize":"76px","fill":"#91DE74"}}>{chartData[0].sum?chartData[0].percent+"%":"暂无考试"}</Text>
                            <Text className="txts-subtitle" y={ props.radius/5+20}  style={{"textAnchor":"middle","fontSize":"20px","fill":"#737373"}}>{"题目数量："+chartData[0].sum}</Text>
                    </G>
                </G>
            </Svg>
        );
      }
});