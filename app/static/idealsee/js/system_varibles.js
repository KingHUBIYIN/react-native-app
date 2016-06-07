$._ = $.i18n.prop;
$.i18n.properties({
    name:'Messages',
    path:i18n_base_path,
    mode:'map',
    // language:'ja-JP',
});
is.an_type = {
    'ANIMATION_NONE' : 0,
    'FADE_IN' : 1,
    'ERASE' : 2,
    'FLY_INTO' : 3,
    'CUT' : 4,
    'FLICKER' : 5,
    'BOUNCE' : 6,
    'FADE_OUT' : 7,
    'ZOOM' : 8,
    'BREATHING_LIGHT':9,
    'ROTATE' : 10,
    'TRUN' : 11,
};
is.action_type = is.actionType = is.widgetType ={
    CALLME : 0,
    LINK:1,
    GEO:2,
    EXTEND:3,
    VIDEO:4,
    THREED:5,
    MUSIC:6,
    ALBUM:7, //相册
    APP_DOWNLOAD:8,
    PICTURE:9,
    TEXT:10,
    TRIGGER:11,

};
is.edit_mode = {
    PAGE:'PAGE',
    TRIGGER:'TRIGGER',
};
is.an_direction = {
    'TOP_TO_BOTTOM':0,
    'BOTTOM_TO_UP':1,
    'LEFT_TO_RIGHT':2,
    'RIGHT_TO_LEFT':3,
};
is.rotate_direction = {
    'CLOCKWISE': 0,
    'COUNTERCLOCKWISE' : 1,
}
is.zoom_type = {
    'ENLARGE': 0,
    'NARROW' : 1,
};
is.preloadImage = function(a, b, c) {
    var d, e;
    b = b || function() {
    };
    d = $('<img>').css({position: 'absolute',left: -99999,top: -99999});
    d.attr({src: a});
    d.appendTo(document.body);
    e = function() {
        b(a, d.prop('width'), d.prop('height'));
        d.remove();
    };
    if (d[0].complete)
        e();
    else {
        d.on('load', e);
        d.on('error', function() {
            d.remove();
            if (c)
                c(a, d);
            throw new Error('Error loading image: ' + a);
        });
    }
};
is.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
        context = this;
        args = arguments;
        timestamp = new Date().getTime();
        var later =
        function() {
            var last = new Date().getTime() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
};
/**
 * 动画类型数据
 * an_type:
 **/
is.AnimationTypeStructs = [
    {
        an_type : 1,
        an_type_display:$._('Fade in'), // 淡入
        image_url:'/static/idealsee/img/layer/animation/btn_danru_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_danru_disabled.png',
        clashs:[5,7],
        attrs:{
            music:true,
            // direction:true,
            exclusive:false,
        },
        not_support_action_types:[is.action_type.THREED]
    },
    {
        an_type : 2,
        an_type_display:$._('Erase'),// 擦出
        image_url:'/static/idealsee/img/layer/animation/btn_cachu_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_cachu_disabled.png',
        clashs:[3,4,5,6,7,8],
        attrs:{
            music:true,
            direction:true,
            exclusive:false,
        },
        not_support_action_types:[is.action_type.THREED]
    },
    {
        an_type : 3,
        an_type_display:$._('Fly into'), // 飞入
        image_url:'/static/idealsee/img/layer/animation/btn_feiru_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_feiru_disabled.png',
        clashs:[2,4,5,6,7],
        attrs:{
            music:true,
            direction:true,
            exclusive:false,
        }
    },
    {
        an_type : 4,
        an_type_display:$._('Cut'), // 切入
        image_url:'/static/idealsee/img/layer/animation/btn_qieru_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_qieru_disabled.png',
        clashs:[2,3,5,6,7],
        attrs:{
            music:true,
            direction:true,
            exclusive:false,
        },
        not_support_action_types:[is.action_type.THREED]
    },
    {
        an_type : 5,
        an_type_display:$._('Opacity'), // 透明度
        image_url:'/static/idealsee/img/layer/animation/btn_toumingdu_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_toumingdu_disabled.png',
        clashs:[1,2,3,4,6,7,8,10,11],
        attrs:{
            music:true,
            // direction:true,
            exclusive:'opacity',
            repeat:true,
        },
        defaults:{
            if_repeat:true,
            single_speed:0.5,
            start_value:0,
            end_value:1,
        },
        not_support_action_types:[is.action_type.THREED]
    },
    {
        an_type : 6,
        an_type_display:$._('Bounce'), // 弹跳
        image_url:'/static/idealsee/img/layer/animation/btn_tantiao_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_tantiao_disabled.png',
        clashs:[2,3,4,5,7],
        attrs:{
            music:true,
            direction:true,
            exclusive:false,
        }
    },
    {
        an_type : 7,
        an_type_display:$._('Fade out'), // 淡出
        image_url:'/static/idealsee/img/layer/animation/btn_jianying_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_jianying_disabled.png',
        clashs:[1,2,3,4,5,6,8,10,11],
        attrs:{
            music:true,
            // direction:true,
            exclusive:false,
        },
        not_support_action_types:[is.action_type.THREED]
    },
    {
        an_type : 8,
        an_type_display:$._('Zoom'), // 缩放
        image_url:'/static/idealsee/img/layer/animation/btn_suofang_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_suofang_disabled.png',
        clashs:[2,5,7],
        attrs:{
            music:true,
            // direction:true,
            exclusive:'zoom',
            repeat:true,
        },
        defaults:{
            if_repeat:true,
            single_speed:0.5,
            start_value:0.5,
            end_value:1.5,
        }
    },
    // {
    //     an_type : 9,
    //     display : false,
    //     an_type_display:$._('Breathing light'), // 呼吸灯
    //     image_url:is.options.SITE_URL
    //         + '/static/idealsee/img/layer/animation/btn_huxideng_normal.png',
    //     image_disabled_url:is.options.SITE_URL
    //         + '/static/idealsee/img/layer/animation/btn_huxideng_disabled.png',
    //     clashs:[],
    //     attrs:{
    //         music:true,
    //         // direction:true,
    //         exclusive:'breating',
    //         repeat:true,
    //     },
    //     defaults:{
    //         if_repeat:true,
    //         single_speed:0.5,
    //     },
    //     not_support_action_types:[is.action_type.THREED]
    // },
    {
        an_type : 10,
        an_type_display:$._('Rotate'), // 旋转
        image_url:'/static/idealsee/img/layer/animation/btn_xuanzhuan_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_xuanzhuan_disabled.png',
        clashs:[5,7],
        attrs:{
            music:true,
            direction:false,
            exclusive:'rotate',
            repeat:true,
        },
        defaults:{
            if_repeat:true,
            single_speed:0.5,
        }
    },
    {
        an_type : 11,
        an_type_display:$._('Turn'), // 翻转
        image_url:'/static/idealsee/img/layer/animation/btn_fanzhuan_normal.png',
        image_disabled_url:'/static/idealsee/img/layer/animation/btn_fanzhuan_disabled.png',
        clashs:[5,7],
        attrs:{
            music:true,
            direction:false,
            exclusive:'turn',
            repeat:false,
        },
        defaults:{
            if_repeat:false,
        }
    }
];

/**
 * 动画类型数据
 * an_type end
 **/

/**
 * 标准元件
 *
 * Call Me = 打电话 0
 * Web Link = WEB链接 1
 * Navigation = 导航 2
 * Introduction to expand = 拓展介绍 3
 * Video = 视频 4
 * ThreeD = 3D 5
 * Music = 音乐 6
 * ALBUM = 相册 7
 * APP DownLoad = APP下载 8
 *
 * StandardButtons start
 **/

is.StandardButtons = [
    {
        name:'call_me',
        type : 0,
        color:'218FE6',
        shape:'circle',
        type_display:$._('Call Me'),
        icon_class:'icon-phone',
    },
    {
        name:'geo',
        type : 2,
        color:'218FE6',
        shape:'circle',
        type_display:$._('Navigation'),
        icon_class:'icon-map',
    },
    {
        name:'app_download',
        type : 8,
        color:'218FE6',
        shape:'circle',
        type_display:$._('APP DownLoad'),
        icon_class:'icon-appdown',
    },
    {
        name:'website',
        type : 1,
        color:'218FE6',
        shape:'circle',
        type_display:$._('Web Link'),
        icon_class:'icon-link',
    },
    {
        name:'expand',
        type : 3,
        color:'218FE6',
        shape:'circle',
        type_display:$._('Introduction to expand'),
        icon_class:'icon-image-text',
    },
];

/**
 * 标准元件
 * StandardButtons end
 **/
is.FeatureButtons = [
    // {
    //     name:'text',
    //     type : 10,
    //     color:'218FE6',
    //     type_display:$._('Text'),
    //     icon_class:'icon-text',
    // },
    {
        name:'picture',
        type : 9,
        color:'218FE6',
        type_display:$._('Picture'),
        icon_class:'icon-image',
    },
    {
        name:'video',
        type : 4,
        color:'218FE6',
        type_display:$._('Video'),
        icon_class:'icon-movie',
    },
    {
        name:'music',
        type : 6,
        color:'218FE6',
        type_display:$._('Music'),
        icon_class:'icon-music',
        icon_src:'/static/idealsee/img/layer/music.gif',
    },
    {
        name:'album',
        type : 7,
        color:'218FE6',
        type_display:$._('Album'),
        icon_class:'icon-images',
    },
    {
        name:'model_3d',
        type : 5,
        color:'218FE6',
        type_display:$._('3D Model'),
        icon_class:'icon-cube',
    },
]
