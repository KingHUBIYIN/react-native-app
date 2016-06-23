var React = require('react');
var Line = require('./Line.react');
var XAxis = require('./XAxis.react');
var YAxis = require('./YAxis.react');
var {Svg,G} = require('react-native-svg');
module.exports = React.createClass({
      displayName: 'LineChart',
      propTypes: {
        datas:React.PropTypes.array,
        colors: React.PropTypes.array,
        axiasFill:React.PropTypes.string,
        width:React.PropTypes.number,
        height:React.PropTypes.number
      },
      getDefaultProps:function() {
        return {
            datas: [],
            colors: ["#91DE74","#FF7E60"],
            axiasFill:"#CCCCCC",
            width:500,
            height:400,
        };
      },
      getChartData:function(){
          var props = this.props;
          var datas = props.datas;
          // 计算最大值
          var xMax = datas.length?datas[0].values.length:0;
          var yMax = 10;
          for(var i=0;i<datas.length;i++){
              for(var j=0;j<datas[i].values.length;j++){
                  var value = datas[i].values[j];
                  if(value.y>yMax) yMax=value.y;
              }
          }
          yMax = Math.ceil(yMax/10)*10;
          
          var chartW = props.width - 60;
          var chartH = props.height - 60;
          
          // YAxis
          var yValues = [],yInterval = chartH*10/yMax;
          for(var i=0;i<=yMax/10;i++){
              var y = chartH-yInterval*i;
              yValues.push({  x1:0, y1:y, x2:chartW, y2:y,name: 10*i });
          }
          // XAxis
          var xValues = [],xInterval = chartW/(xMax-1);
          for(var i=0;i<xMax;i++){
              var x = i*xInterval;
              xValues.push({  x1:x, y1:chartH, x2:x, y2:chartH+7,name:  datas[0].values[i].x });
          }
          // Lines
          var Values = [];
          for(var i=0;i<datas.length;i++){
              var pathData = [];
              for(var j=0;j<xMax;j++){
                  var y = datas[i].values[j].y;
                  pathData.push({
                      x: j*xInterval,
                      y: chartH-y*yInterval/10
                  })
              }
              var color = props.colors[i%props.colors.length];
              Values.push({
                  data:pathData,
                  color:color
              })
          }
          
          return {
              xValues:xValues,
              yValues:yValues,
              Values:Values
          }
      },
      render:function() {
        var props = this.props;
        var chartData = this.getChartData();
        var lineKey = 0;
        
        var lines = chartData.Values.map(function(ele,pos){
            return (
                React.createElement(Line,{
                    "key":lineKey++,
                    "fill":ele.color, 
                    "data":ele.data
                },null)
            )
        });
        
        return (
            <Svg className="linechart" width={props.width} height={props.height} >
                    <G className="linechart-graphics" transform="translate(45,10)">
                            <XAxis data={chartData.xValues} fill={ props.axiasFill}/>
                            <YAxis data={chartData.yValues} fill={ props.axiasFill}/>
                            <G className="graphics-lines" >
                                {lines}
                            </G>
                    </G>
            </svg>
        );
      }
});