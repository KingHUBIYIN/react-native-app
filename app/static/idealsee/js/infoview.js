function getSecondFormat(second){
    var hour = Math.floor(second / 3600);
    var min = Math.floor((second % 3600) / 60);
    var sec = second % 60;
    return add0(hour) + ":" + add0(min) + ":" + add0(sec);
};
function add0(num){
    if (num < 10){
        return "0" + num.toString();
    } else {
        return num.toString();
    }
};
function showTimeFlot(infodata, comparedata, data_name, compare_data_name, xticks, yticks, period_type, compare_time_dec){
    var plot = $.plot("#placeholder", [{"label":data_name, "data":infodata, "color": "#00F"},
                            {"label":compare_data_name, "data":comparedata, "color": "#F00"}], 
        {
            "series": {
                "lines": {"show": true},
                "points": {"show": true}
            },
            "xaxis": {
                // "ticks":xticks,
                // "tickDecimals": 0
                "mode": "time",
                "timezone": "browser"
            },
            "yaxis": {
                "ticks": yticks,
                "min": 0,
                "tickDecimals": 0
            },
            "grid": {
                "backgroundColor": { "colors": [ "#fff", "#eee" ] },
                "borderWidth": {
                    "top": 1,
                    "right": 1,
                    "bottom": 2,
                    "left": 2
                },
                "hoverable": true
            }
        }
    );

    var t_dec = Number(compare_time_dec) * 1000;
    var previousPoint = null;
    $("#placeholder").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {

                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(0),
                y = item.datapoint[1].toFixed(0);

                var xlabel = "";
                var d = new Date();
                if (item.seriesIndex == 0) {
                    d.setTime(x);
                } else {
                    d.setTime(Number(x) + t_dec);
                }       
                if (period_type == "1") {
                    xlabel = add0(d.getHours()) + ":00";
                } else {
                    xlabel = add0(d.getMonth() + 1) + "-" + add0(d.getDate());
                }
                showTooltip(item.pageX, item.pageY,
                    "<div id='tooltip'><span style='background-color:#ddd'>&nbsp;" + xlabel + "&nbsp;</span><br>&nbsp;" + y + "&nbsp;</div>"
                    );
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
    });
};
function showTooltip(x, y, contents) {
    $(contents).css({
        position: "absolute",
        display: "none",
        top: y + 10,
        left: x + 10,
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 1
    }).appendTo("body").fadeIn(200);
};

function showTimeFlot2(infodata, yticks, period_type, holder_name){
    var plot = $.plot(holder_name, infodata, 
        {
            "series": {
                "lines": {"show": true},
                "points": {"show": true}
            },
            "xaxis": {
                "mode": "time",
                "timezone": "browser"
            },
            "yaxis": {
                "ticks": yticks,
                "min": 0,
                "tickDecimals": 0
            },
            "grid": {
                "backgroundColor": { "colors": [ "#fff", "#eee" ] },
                "borderWidth": {
                    "top": 1,
                    "right": 1,
                    "bottom": 2,
                    "left": 2
                },
                "hoverable": true,
                "autoHighlight":true,
            }
        }
    );

    var previousPoint = null;
    $(holder_name).bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {

                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(0),
                y = item.datapoint[1];

                var xlabel = "";
                var d = new Date();
                d.setTime(x);     
                if (period_type == "1") {
                    xlabel = add0(d.getHours()) + ":00";
                } else {
                    xlabel = add0(d.getMonth() + 1) + "-" + add0(d.getDate());
                }
                showTooltip2(item.pageX, item.pageY,
                    "<div id='tooltip'><span style='background-color:#ddd'>&nbsp;" + xlabel + "&nbsp;</span><br>&nbsp;" + y + "&nbsp;</div>"
                    );
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
    });
};

function showTooltip2(x, y, contents) {
    $(contents).css({
        position: "absolute",
        display: "none",
        top: y - 35,
        left: x + 10,
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 1
    }).appendTo("body").fadeIn(200);
};

function labelFormatter(label, series) {
        return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
    }

function showPieFlot(infodata){
    var plot = $.plot("#pieholder", infodata, 
        {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 3/4,
                        formatter: labelFormatter,
                        background: {
                            opacity: 0.5,
                            color:"#000"
                        }
                    }
                }
            },
            legend: {
                show: true
            }
            
        }
    );
};

function showBarFlot(infodata){
    var datas = [
                 {"label":infodata.label,
                  "data":infodata.datas,
                   "color": "green",
                    bars: {
                        show: true,
                        barWidth: 0.8,
                        align: "center"
                    },
                 }
                ]
    var plot = $.plot("#barholder", datas, 
        {
            xaxis: {
                ticks: infodata.x_ticks,
                tickLength: 0
            },
            yaxis: {
                ticks: infodata.y_ticks,
                min: 0,
                tickDecimals: 0
            },
            grid: {
                hoverable: true,
            }
        }
    );

    var previousPoint = null;
    var previousLabel = null;
    $("#barholder").bind("plothover", function (event, pos, item) {
        if (item) {
            if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;
                $("#tooltip").remove();

                var x = item.datapoint[0];
                var y = item.datapoint[1];

                var color = item.series.color;
            

                showBarTooltip(item.pageX,
                item.pageY,
                color,
                "<strong>" + item.series.label + "</strong><br>" + item.series.xaxis.ticks[x].label + " : <strong>" + y + "</strong>");
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};

function showDoubleBarFlot(infodata){
    var datas = [
                 {"label":infodata.yes_label,
                  "data":infodata.yes_datas,
                   "color": "red",
                    bars: {
                        show: true,
                        barWidth: 0.8,
                        align: "center"
                    },
                 },
                 {"label":infodata.today_label,
                  "data":infodata.today_datas,
                   "color": "green",
                    bars: {
                        show: true,
                        barWidth: 0.8,
                        align: "center"
                    }
                 },
                ]
    var plot = $.plot("#barholder", datas, 
        {
            xaxis: {
                ticks: infodata.x_ticks,
                tickLength: 0
            },
            yaxis: {
                ticks: infodata.y_ticks,
                min: 0,
                tickDecimals: 0
            },
            grid: {
                hoverable: true,
            }
        }
    );

    var previousPoint = null;
    var previousLabel = null;
    $("#barholder").bind("plothover", function (event, pos, item) {
        if (item) {
            if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;
                $("#tooltip").remove();

                var x = item.datapoint[0];
                var y = item.datapoint[1];

                var color = item.series.color;
            

                showBarTooltip(item.pageX,
                item.pageY,
                color,
                "<strong>" + item.series.label + "</strong><br>" + item.series.xaxis.ticks[x].label + " : <strong>" + y + "</strong>");
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};

function showBarTooltip(x, y, color, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y - 100,
        left: x - 40,
        border: '2px solid ' + color,
        padding: '3px',
        'font-size': '9px',
        'border-radius': '5px',
        'background-color': '#fff',
        'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
        opacity: 0.9
    }).appendTo("body").fadeIn(200);
}