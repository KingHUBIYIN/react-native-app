(function($) {
    $.fn.citySelect = function(settings) {
        if (this.length < 1) {
            return;
        };

        // 默认值
        settings = $.extend({
            url: "static/json/city.json",
            prov: null,
            city: null,
            dist: null,
            nodata: null
        }, settings);

        var box_obj = this;
        var prov_obj = box_obj.find(".prov");
        var city_obj = box_obj.find(".city");
        var dist_obj = box_obj.find(".dist");
        var prov_val = settings.prov;
        var city_val = settings.city;
        var dist_val = settings.dist;
        var select_prehtml = "<option value=''>选择省</option>";
        var select_prehtml2 = "<option value=''>选择城市</option>";
        var select_prehtml3 = "<option value=''>选择区县</option>";
        var city_json;

        // 赋值市级函数
        var cityStart = function() {
            var prov_id = prov_obj.get(0).selectedIndex;
            if (!settings.required) {
                prov_id--;
            };
            city_obj.empty().attr("disabled", true);
            dist_obj.empty().attr("disabled", true);

            if (prov_id >= 0) {
                // 遍历赋值市级下拉列表
                temp_html = select_prehtml2;
                $.each(city_json[prov_id].city, function(i, city) {
                    temp_html += "<option value='" + city.name + "'>" + city.name + "</option>";
                });
                city_obj.html(temp_html).attr("disabled", false).css({"display": "", "visibility": ""});
                city_obj.val(city_json[prov_id].city[0].name);
                distStart();
            }
        };

        // 赋值地区（县）函数
        var distStart = function() {
            var prov_id = prov_obj.get(0).selectedIndex;
            var city_id = city_obj.get(0).selectedIndex;
            if (!settings.required) {
                prov_id--;
                city_id--;
            }
            ;
            dist_obj.empty().attr("disabled", true);

            if (city_id >= 0) {
                // 遍历赋值市级下拉列表
                temp_html = select_prehtml3;
                $.each(city_json[prov_id].city[city_id].area, function(i, dist) {
                    temp_html += "<option value='" + dist + "'>" + dist + "</option>";
                });
                dist_obj.html(temp_html).attr("disabled", false).css({"display": "", "visibility": ""});
                dist_obj.val(city_json[prov_id].city[city_id].area[0]);
            }
        };

        var init = function() {
            // 遍历赋值省份下拉列表
            temp_html = select_prehtml;
            $.each(city_json, function(i, prov) {
                temp_html += "<option value='" + prov.name + "'>" + prov.name + "</option>";
            });
            prov_obj.html(temp_html);

            // 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
            if (settings.prov != null) {
                prov_obj.val(settings.prov);
                cityStart();
                if (settings.city != null) {
                    city_obj.val(settings.city);
                    distStart();
                    if (settings.dist != null) {
                        dist_obj.val(settings.dist);
                    };
                };
            };

            // 选择省份时发生事件
            prov_obj.bind("change", function() {
                cityStart();
            });

            // 选择市级时发生事件
            city_obj.bind("change", function() {
                distStart();
            });
        };

        // 设置省市json数据
        if (typeof (settings.url) == "string") {
            $.getJSON(settings.url, function(json) {
                city_json = json;
                init();
            });
        } else {
            city_json = settings.url;
            console.log(city_json);
            init();
        }
        ;
    };
})(jQuery);







// var j_address = "static/json/city.json";
// var provdatas  = new Object();
// var provs      = new Array();
